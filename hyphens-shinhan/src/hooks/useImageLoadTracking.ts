import { useState, useEffect, useCallback, useRef, useMemo } from 'react'

/**
 * 여러 이미지의 로드 상태를 추적하는 훅
 * @param imageUrls - 추적할 이미지 URL 배열
 * @returns {object} { allImagesLoaded: boolean, loadedCount: number, totalCount: number }
 */
export const useImageLoadTracking = (imageUrls: (string | null | undefined)[] | undefined) => {
  const [loadedUrls, setLoadedUrls] = useState<Set<string>>(new Set())
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set())
  const imageRefs = useRef<Map<string, HTMLImageElement>>(new Map())
  const previousUrlsRef = useRef<string>('')

  // 유효한 이미지 URL만 필터링
  const validUrls = useMemo(() => {
    return imageUrls?.filter((url): url is string => Boolean(url)) || []
  }, [imageUrls])
  const totalCount = validUrls.length

  // URL 배열을 문자열로 변환하여 변경 감지
  const urlsKey = useMemo(() => validUrls.join(','), [validUrls])

  // 이미지 로드 완료 핸들러
  const handleImageLoad = useCallback((url: string) => {
    setLoadedUrls((prev) => {
      const next = new Set(prev)
      next.add(url)
      return next
    })
  }, [])

  // 이미지 로드 실패 핸들러
  const handleImageError = useCallback((url: string) => {
    setFailedUrls((prev) => {
      const next = new Set(prev)
      next.add(url)
      return next
    })
    // 실패한 이미지도 로드 완료로 간주 (에러 처리 완료)
    setLoadedUrls((prev) => {
      const next = new Set(prev)
      next.add(url)
      return next
    })
  }, [])

  // 이미지 URL이 변경되면 상태 초기화
  useEffect(() => {
    if (urlsKey !== previousUrlsRef.current) {
      setLoadedUrls(new Set())
      setFailedUrls(new Set())
      // 진행 중인 이미지 로드 취소
      imageRefs.current.forEach((img) => {
        img.onload = null
        img.onerror = null
      })
      imageRefs.current.clear()
      previousUrlsRef.current = urlsKey
    }
  }, [urlsKey])

  // 이미지 프리로드
  useEffect(() => {
    if (validUrls.length === 0) {
      return
    }

    const urlsToLoad = validUrls.filter((url) => {
      // 이미 로드된 URL은 스킵
      if (loadedUrls.has(url) || failedUrls.has(url)) {
        return false
      }
      // 이미 생성된 이미지 엘리먼트가 있으면 스킵
      if (imageRefs.current.has(url)) {
        return false
      }
      return true
    })

    urlsToLoad.forEach((url) => {
      const img = new Image()
      imageRefs.current.set(url, img)

      img.onload = () => {
        handleImageLoad(url)
        imageRefs.current.delete(url)
      }

      img.onerror = () => {
        handleImageError(url)
        imageRefs.current.delete(url)
      }

      img.src = url
    })

    // cleanup: 진행 중인 이미지 로드 취소
    return () => {
      imageRefs.current.forEach((img) => {
        img.onload = null
        img.onerror = null
      })
      imageRefs.current.clear()
    }
  }, [validUrls, urlsKey, handleImageLoad, handleImageError, loadedUrls, failedUrls])

  const loadedCount = loadedUrls.size
  const allImagesLoaded = totalCount > 0 ? loadedCount >= totalCount : true

  return {
    allImagesLoaded,
    loadedCount,
    totalCount,
    failedUrls: Array.from(failedUrls),
  }
}
