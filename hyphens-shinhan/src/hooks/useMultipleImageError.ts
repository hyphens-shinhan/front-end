import { useState, useCallback } from 'react'

/**
 * 여러 이미지의 로드 에러를 처리하는 훅
 * @returns {object} { failedIndices: Set<number>, handleImageError: (index: number) => void, isFailed: (index: number) => boolean, resetErrors: () => void }
 */
export const useMultipleImageError = () => {
  const [failedIndices, setFailedIndices] = useState<Set<number>>(new Set())

  const handleImageError = useCallback((index: number) => {
    setFailedIndices((prev) => new Set(prev).add(index))
  }, [])

  const isFailed = useCallback((index: number) => {
    return failedIndices.has(index)
  }, [failedIndices])

  const resetErrors = useCallback(() => {
    setFailedIndices(new Set())
  }, [])

  return {
    failedIndices,
    handleImageError,
    isFailed,
    resetErrors,
  }
}

/**
 * 여러 이미지의 로드 에러를 ID로 처리하는 훅 (문자열 ID 사용)
 * @returns {object} { failedIds: Set<string>, handleImageError: (id: string) => void, isFailed: (id: string) => boolean, resetErrors: () => void }
 */
export const useMultipleImageErrorById = () => {
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set())

  const handleImageError = useCallback((id: string) => {
    setFailedIds((prev) => new Set(prev).add(id))
  }, [])

  const isFailed = useCallback((id: string) => {
    return failedIds.has(id)
  }, [failedIds])

  const resetErrors = useCallback(() => {
    setFailedIds(new Set())
  }, [])

  return {
    failedIds,
    handleImageError,
    isFailed,
    resetErrors,
  }
}
