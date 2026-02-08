/**
 * Receipt OCR utilities (frontend-only).
 * Uses Tesseract.js in the browser to extract text from receipt images and parse item names + prices.
 * Tesseract is loaded dynamically; use processReceiptOCR() only from client components.
 */

let tesseractModule: typeof import('tesseract.js') | null = null

async function getTesseract() {
  if (!tesseractModule) {
    tesseractModule = await import('tesseract.js')
  }
  return tesseractModule
}

export interface ExtractedItem {
  name: string
  price: number
}

export async function extractTextFromImage(imageFile: File): Promise<string> {
  const tesseract = await getTesseract()
  const { createWorker, PSM } = tesseract
  // 'kor+eng' loads Korean + English trained data (first run may download ~5MB for kor)
  const worker = await createWorker('kor+eng')
  try {
    // PSM.SINGLE_BLOCK (6) = one block of text, better for receipts
    await worker.setParameters({ tessedit_pageseg_mode: PSM.SINGLE_BLOCK })
    const {
      data: { text },
    } = await worker.recognize(imageFile)
    return text ?? ''
  } finally {
    await worker.terminate()
  }
}

function cleanPrice(priceStr: string): number {
  const cleaned = priceStr
    .replace(/[¢©]/g, '9')
    .replace(/[Oo]/g, '0')
    .replace(/[l|]/g, '1')
    .replace(/[,\s]/g, '')
    .replace(/[^\d]/g, '')
  return parseFloat(cleaned) || 0
}

function hasKoreanText(text: string): boolean {
  return /[가-힣]/.test(text)
}

/**
 * Parse OCR text into item name + price pairs (same logic as hyphens-frontend).
 */
export function parseReceiptItems(ocrText: string): ExtractedItem[] {
  const items: ExtractedItem[] = []
  const lines = ocrText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  let startIndex = 0
  for (let i = 0; i < lines.length; i++) {
    if (
      /(상품명|품목|품명|ITEM|PRODUCT)/i.test(lines[i]) &&
      /(단가|수량|금액|가격|PRICE|AMOUNT)/i.test(lines[i])
    ) {
      startIndex = i + 1
      break
    }
  }

  const skipKeywords = [
    '영수증',
    'RECEIPT',
    'TOTAL',
    '합계',
    '소계',
    'SUBTOTAL',
    'TAX',
    '세금',
    '부가세',
    'VAT',
    '할인',
    'DISCOUNT',
    '거스름돈',
    'CHANGE',
    '받은금액',
    '지불금액',
    'PAID',
    '카드',
    'CARD',
    '현금',
    'CASH',
    '포인트',
    'POINT',
    '일시',
    '날짜',
    'DATE',
    'TIME',
    '시간',
    '주소',
    'ADDRESS',
    '전화',
    'PHONE',
    '사업자',
    '등록번호',
    '번호',
    'POS',
    '상품명',
    '단가',
    '수량',
    '금액',
    '품목',
    '품명',
  ]

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i]
    if (line.length < 3) continue
    if (skipKeywords.some((k) => line.includes(k))) continue
    if (/^[\d\s,.\-¢]+$/.test(line)) continue
    if (/(\d{2,3}-\d{3,4}-\d{4}|\d{4}-\d{2}-\d{2}|\d{2}:\d{2})/.test(line))
      continue

    let itemName = ''
    let price = 0

    const sameLinePattern =
      /([가-힣\w\s()]+?)\s+([\d]{1,3}(?:[,\s]?[\d]{3})*)\s*(?:원|₩)?/
    const sameLineMatch = line.match(sameLinePattern)
    if (sameLineMatch?.[1] && sameLineMatch?.[2]) {
      itemName = sameLineMatch[1].trim()
      price = cleanPrice(sameLineMatch[2])
      if (hasKoreanText(itemName) && price >= 1000 && price < 100_000_000) {
        items.push({ name: itemName, price: Math.round(price) })
        continue
      }
    }

    if (hasKoreanText(line) && i + 1 < lines.length) {
      const nextLine = lines[i + 1]
      const priceMatch = nextLine.match(/([\d]{1,3}(?:[,\s]?[\d]{3})*)/)
      if (priceMatch) {
        const potentialPrice = cleanPrice(priceMatch[1])
        if (
          potentialPrice >= 1000 &&
          potentialPrice < 100_000_000 &&
          !skipKeywords.some((k) => line.includes(k)) &&
          line.length > 2
        ) {
          items.push({ name: line.trim(), price: Math.round(potentialPrice) })
          i++
          continue
        }
      }
    }

    const priceAtEndPattern =
      /(.+?)\s+([\d]{1,3}(?:[,\s]?[\d]{3})*)\s*(?:원|₩)?$/
    const priceAtEndMatch = line.match(priceAtEndPattern)
    if (priceAtEndMatch?.[1] && priceAtEndMatch?.[2]) {
      const potentialName = priceAtEndMatch[1].trim()
      const potentialPrice = cleanPrice(priceAtEndMatch[2])
      if (
        hasKoreanText(potentialName) &&
        potentialPrice >= 1000 &&
        potentialPrice < 100_000_000
      ) {
        const name = potentialName
          .replace(/\s+/g, ' ')
          .replace(/[^\w가-힣\s()]/g, '')
          .trim()
        if (name.length >= 2) {
          items.push({ name, price: Math.round(potentialPrice) })
        }
      }
    }
  }

  const uniqueItems = items.filter((item, index, self) => {
    if (!hasKoreanText(item.name)) return false
    if (item.price < 1000 || item.price >= 100_000_000) return false
    const isDuplicate =
      index !==
      self.findIndex(
        (i) =>
          i.name === item.name || Math.abs(i.price - item.price) < 100
      )
    const isMostlyNumbers = /^[\d\s,.\-]+$/.test(item.name)
    return !isDuplicate && !isMostlyNumbers
  })

  return uniqueItems
}

/**
 * Run OCR on a receipt image and return parsed items (name + price).
 * Uses Tesseract.js in the browser only (frontend-only, no backend API).
 */
export async function processReceiptOCR(
  imageFile: File
): Promise<ExtractedItem[]> {
  if (typeof window === 'undefined') {
    throw new Error('OCR can only run in browser environment')
  }
  const ocrText = await extractTextFromImage(imageFile)
  if (!ocrText?.trim()) {
    throw new Error(
      '영수증에서 텍스트를 읽을 수 없습니다. 이미지가 선명한지 확인해주세요.'
    )
  }
  const items = parseReceiptItems(ocrText)
  return items
}
