import { useState, useCallback } from 'react'

/**
 * 이미지 로드 에러를 처리하는 훅
 * @returns {object} { imageError: boolean, handleImageError: () => void, resetError: () => void }
 */
export const useImageError = () => {
  const [imageError, setImageError] = useState(false)

  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])

  const resetError = useCallback(() => {
    setImageError(false)
  }, [])

  return {
    imageError,
    handleImageError,
    resetError,
  }
}
