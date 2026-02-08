import apiClient from './apiClient'

/** Same shape as utils/ocr.ts ExtractedItem (name + price). */
export interface ReceiptOcrItem {
  name: string
  price: number
}

export interface ReceiptOcrResponse {
  items: ReceiptOcrItem[]
}

const OCR_RECEIPT_PATH = '/ocr/receipt'

/** First run can load language data (1–2 min); use long timeout. */
const OCR_REQUEST_TIMEOUT_MS = 180_000

/**
 * Send receipt image to plimate-server OCR API; returns extracted items.
 * Uses same parsing logic as backend (kor+eng Tesseract + receipt item rules).
 * Requires auth (Bearer token via apiClient interceptor).
 * Prefer this over client-side OCR when available.
 */
export async function processReceiptOCRViaApi(
  imageFile: File
): Promise<ReceiptOcrItem[]> {
  const formData = new FormData()
  formData.append('file', imageFile)

  const { data } = await apiClient.post<ReceiptOcrResponse>(
    OCR_RECEIPT_PATH,
    formData,
    { timeout: OCR_REQUEST_TIMEOUT_MS }
  )
  return data.items
}
