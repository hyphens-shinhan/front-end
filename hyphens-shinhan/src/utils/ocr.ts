// Dynamic import to avoid SSR issues with Tesseract.js
let tesseractModule: typeof import('tesseract.js') | null = null;

async function getTesseract() {
  if (!tesseractModule) {
    tesseractModule = await import('tesseract.js');
  }
  return tesseractModule;
}

/** CDN base paths so worker and WASM load reliably */
const TESSERACT_CDN = {
  worker: 'https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0/dist/worker.min.js',
  core: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@7.0.0',
};

/** Upscale factor so Tesseract sees larger text (tiny receipt fonts need this) */
const OCR_UPSCALE = 2;

/** Grayscale threshold for binarization (thermal receipts: dark text on light or vice versa) */
const BINARIZE_THRESHOLD = 140;

/**
 * Preprocess receipt image for OCR: upscale 2x, grayscale, binarize (threshold).
 * Thermal receipts need this for readable text; raw photos give poor results.
 */
function preprocessImage(file: File): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      const canvas = document.createElement('canvas');
      canvas.width = w * OCR_UPSCALE;
      canvas.height = h * OCR_UPSCALE;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2d not available'));
        return;
      }
      ctx.scale(OCR_UPSCALE, OCR_UPSCALE);
      ctx.drawImage(img, 0, 0);
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
        const value = gray > BINARIZE_THRESHOLD ? 255 : 0;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
      }

      let sum = 0;
      for (let i = 0; i < data.length; i += 4) sum += data[i];
      const mean = sum / (data.length / 4);
      if (mean < 128) {
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];
          data[i + 1] = 255 - data[i + 1];
          data[i + 2] = 255 - data[i + 2];
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

export interface ExtractedItem {
  name: string;
  /** Line total (금액) */
  price: number;
  /** 수량 (when receipt has table format) */
  quantity?: number;
  /** 단가 (unit price, when receipt has table format) */
  unitPrice?: number;
}

/**
 * Extract text from a receipt image using OpenAI GPT-4o vision (via /api/ocr/receipt).
 * Uses OPENAI_API_KEY from server env; keeps the key off the client.
 */
async function extractTextFromImageViaOpenAI(imageFile: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', imageFile);

  const res = await fetch('/api/ocr/receipt', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    const message =
      typeof err?.error === 'string' ? err.error : '영수증 OCR 요청에 실패했습니다.';
    throw new Error(message);
  }

  const data = (await res.json()) as { text?: string };
  const text = data.text ?? '';
  if (!text.trim()) {
    throw new Error('OpenAI returned no text');
  }
  return text;
}

/**
 * Extract text from an image using OCR with receipt-optimized settings.
 * In the browser uses OpenAI GPT-4o via /api/ocr/receipt when available.
 * Fallback: Tesseract (Korean-only, preprocessed).
 */
export async function extractTextFromImage(imageFile: File): Promise<string> {
  if (typeof window !== 'undefined') {
    try {
      return await extractTextFromImageViaOpenAI(imageFile);
    } catch (e) {
      console.warn('OpenAI receipt OCR failed, falling back to Tesseract:', e);
    }
  }

  const Tesseract = await getTesseract();
  const { createWorker, PSM, OEM } = Tesseract;

  const worker = await createWorker('kor', OEM.LSTM_ONLY, {
    workerPath: TESSERACT_CDN.worker,
    corePath: TESSERACT_CDN.core,
    logger: () => {},
  });

  await worker.setParameters({
    tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
  });

  const canvas = await preprocessImage(imageFile);
  const { data } = await worker.recognize(canvas);
  await worker.terminate();

  return data.text ?? '';
}

/** True if text looks like a product name (Korean, or at least 2 Latin letters) */
function looksLikeItemName(text: string): boolean {
  if (/[가-힣]/.test(text)) return true;
  if (/[a-zA-Z]{2,}/.test(text) && !/^\d+$/.test(text)) return true;
  return false;
}

/**
 * Parse OCR text to extract line items (세부 내역) with names and prices.
 * Supports: table rows (상품명 수량 단가 금액), same-line "name price", two-line name+price, price at end.
 */
export function parseReceiptItems(ocrText: string): ExtractedItem[] {
  const items: ExtractedItem[] = [];
  const lines = ocrText.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);

  // Find where item list starts: header row with "상품명/품목" and "금액/단가/수량", or just "금액"/"상품"
  let itemsStartIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (
      (/(상품명|품목|품명|ITEM|PRODUCT)/i.test(line) && /(단가|수량|금액|가격|PRICE|AMOUNT)/i.test(line)) ||
      (/^(상품|품목|금액|내역)\s*$/i.test(line))
    ) {
      itemsStartIndex = i + 1;
      break;
    }
  }

  const startIndex = itemsStartIndex > 0 ? itemsStartIndex : 0;

  // Table format: "상품명 수량 단가 금액" per line (e.g. "광천)해저파래도 1 2,950 2,950" or "Americano 1 4,500 4,500")
  const tableRowPattern = /^(.+?)\s+(\d+)\s+([\d,]+)\s+([\d,]+)\s*$/;

  const skipKeywords = [
    '영수증', 'RECEIPT', 'TOTAL', '합계', '소계', 'SUBTOTAL',
    'TAX', '세금', '부가세', 'VAT', '할인', 'DISCOUNT',
    '거스름돈', 'CHANGE', '받은금액', '지불금액', 'PAID',
    '카드', 'CARD', '현금', 'CASH', '포인트', 'POINT',
    '일시', '날짜', 'DATE', 'TIME', '시간', '주소', 'ADDRESS',
    '전화', 'PHONE', '사업자', '등록번호', '번호', 'POS',
    '상품명', '단가', '수량', '금액', '품목', '품명',
  ];

  function cleanPrice(priceStr: string): number {
    const cleaned = priceStr
      .replace(/[¢©]/g, '9')
      .replace(/[Oo]/g, '0')
      .replace(/[l|]/g, '1')
      .replace(/[,\s]/g, '')
      .replace(/[^\d]/g, '');
    return parseFloat(cleaned) || 0;
  }

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    if (line.length < 2) continue;

    const isSkipLine = skipKeywords.some((keyword) => line.includes(keyword));
    if (isSkipLine) continue;

    if (/^[\d\s,.\-¢]+$/.test(line)) continue;
    if (/(\d{2,3}-\d{3,4}-\d{4}|\d{4}-\d{2}-\d{2}|\d{2}:\d{2})/.test(line)) continue;

    let itemName = '';
    let price = 0;
    let quantity: number | undefined;
    let unitPrice: number | undefined;

    // 1) Table row: 상품명 수량 단가 금액 (Korean or English product names)
    const tableMatch = line.match(tableRowPattern);
    if (tableMatch?.[1] && tableMatch?.[2] && tableMatch?.[3] && tableMatch?.[4]) {
      const namePart = tableMatch[1].trim();
      const qty = parseInt(tableMatch[2], 10);
      const unit = cleanPrice(tableMatch[3]);
      const amount = cleanPrice(tableMatch[4]);
      if (qty >= 1 && qty <= 999 && unit >= 100 && unit < 100000000 && amount >= 100 && amount < 100000000) {
        if (looksLikeItemName(namePart) || /[\w)\]]/.test(namePart)) {
          itemName = namePart.replace(/\s+/g, ' ').trim();
          if (itemName.length >= 2) {
            items.push({ name: itemName, price: Math.round(amount), quantity: qty, unitPrice: Math.round(unit) });
            continue;
          }
        }
      }
    }

    // 2) Same line: "상품명  금액" or "Name 4,500" (name + price on one line)
    const sameLinePattern = /([가-힣a-zA-Z\w\s()]+?)\s+([\d]{1,3}(?:[,\s]?[\d]{3})*)\s*(?:원|₩)?\s*$/;
    const sameLineMatch = line.match(sameLinePattern);
    if (sameLineMatch?.[1] && sameLineMatch?.[2]) {
      itemName = sameLineMatch[1].trim();
      price = cleanPrice(sameLineMatch[2]);
      if (looksLikeItemName(itemName) && price >= 100 && price < 100000000) {
        const nameClean = itemName.replace(/\s+/g, ' ').replace(/[^\w가-힣\s()]/g, '').trim();
        if (nameClean.length >= 2 && !/^[\d\s,.\-]+$/.test(nameClean)) {
          items.push({ name: nameClean, price: Math.round(price) });
          continue;
        }
      }
    }

    // 3) Two lines: product name on this line, price on next line
    if (looksLikeItemName(line) && i + 1 < lines.length) {
      const nextLine = lines[i + 1];
      const priceMatch = nextLine.match(/([\d]{1,3}(?:[,\s]?[\d]{3})*)\s*(?:원|₩)?/);
      if (priceMatch) {
        const potentialPrice = cleanPrice(priceMatch[1]);
        if (potentialPrice >= 100 && potentialPrice < 100000000) {
          if (!skipKeywords.some((k) => line.includes(k)) && line.length > 1) {
            itemName = line.replace(/\s+/g, ' ').trim();
            if (!/^[\d\s,.\-]+$/.test(itemName)) {
              items.push({ name: itemName, price: Math.round(potentialPrice) });
              i++;
              continue;
            }
          }
        }
      }
    }

    // 4) Price at end of line: "상품명 ... 4,500원"
    const priceAtEndPattern = /(.+?)\s+([\d]{1,3}(?:[,\s]?[\d]{3})*)\s*(?:원|₩)?\s*$/;
    const priceAtEndMatch = line.match(priceAtEndPattern);
    if (priceAtEndMatch?.[1] && priceAtEndMatch?.[2]) {
      const potentialName = priceAtEndMatch[1].trim();
      const potentialPrice = cleanPrice(priceAtEndMatch[2]);
      if (looksLikeItemName(potentialName) && potentialPrice >= 100 && potentialPrice < 100000000) {
        itemName = potentialName.replace(/\s+/g, ' ').replace(/[^\w가-힣\s()]/g, '').trim();
        if (itemName.length >= 2 && !/^[\d\s,.\-]+$/.test(itemName)) {
          items.push({ name: itemName, price: Math.round(potentialPrice) });
          continue;
        }
      }
    }
  }

  return items.filter((item, index, self) => {
    if (!looksLikeItemName(item.name)) return false;
    if (item.price < 100 || item.price >= 100000000) return false;
    const isDuplicate =
      index !== self.findIndex((i) => i.name === item.name || Math.abs(i.price - item.price) < 100);
    const isMostlyNumbers = /^[\d\s,.\-]+$/.test(item.name);
    return !isDuplicate && !isMostlyNumbers;
  });
}

/** Extract a single total amount from OCR text when line items are not found */
function extractTotalFromText(ocrText: string): number | null {
  const lines = ocrText.split('\n').map((l) => l.trim()).filter(Boolean);
  const totalPatterns = [
    /(?:합계|총액|총\s*금액|total|TOTAL)\s*[:\s]*([\d]{1,3}(?:[,\s]?[\d]{3})*)\s*(?:원|₩)?/i,
    /([\d]{1,3}(?:[,\s]?[\d]{3})*)\s*원?\s*$/,
  ];
  for (const line of lines) {
    for (const re of totalPatterns) {
      const m = line.match(re);
      if (m?.[1]) {
        const n = parseInt(m[1].replace(/[,\s]/g, ''), 10);
        if (n >= 1000 && n < 100000000) return n;
      }
    }
  }
  const allNumbers = ocrText.match(/[\d]{1,3}(?:[,\s]?[\d]{3})+/g);
  if (allNumbers?.length) {
    const parsed = allNumbers.map((s) => parseInt(s.replace(/[,\s]/g, ''), 10));
    const valid = parsed.filter((n) => n >= 1000 && n < 100000000);
    if (valid.length) return Math.max(...valid);
  }
  return null;
}

/**
 * Process receipt image and extract items with prices
 */
export async function processReceiptOCR(imageFile: File): Promise<ExtractedItem[]> {
  if (typeof window === 'undefined') {
    throw new Error('OCR can only run in browser environment');
  }

  const ocrText = await extractTextFromImage(imageFile);

  if (!ocrText || ocrText.trim().length === 0) {
    throw new Error('영수증에서 텍스트를 읽을 수 없습니다. 이미지가 선명한지 확인해주세요.');
  }

  const items = parseReceiptItems(ocrText);
  if (items.length > 0) return items;

  const total = extractTotalFromText(ocrText);
  if (total != null) return [{ name: '총 비용', price: total }];

  return [];
}
