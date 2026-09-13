import { useCallback, useEffect, useState } from 'react'
import { exitDocumentFullscreen, getFullscreenElement, isFullscreenSupported, requestElementFullscreen } from '../utils/fullscreen.js'

export default function useFullscreen(targetRef) {
  const [supported, setSupported] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const requestCanvasResize = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
    })
  }, [])

  useEffect(() => {
    const syncFullscreenState = () => {
      setSupported(isFullscreenSupported(targetRef.current, document))
      setIsFullscreen(Boolean(getFullscreenElement(document)))
      requestCanvasResize()
    }

    document.addEventListener('fullscreenchange', syncFullscreenState)
    document.addEventListener('webkitfullscreenchange', syncFullscreenState)
    syncFullscreenState()

    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreenState)
      document.removeEventListener('webkitfullscreenchange', syncFullscreenState)
    }
  }, [requestCanvasResize, targetRef])

  const toggleFullscreen = useCallback(async () => {
    if (!supported || !targetRef.current) return false
    try {
      return getFullscreenElement(document)
        ? await exitDocumentFullscreen(document)
        : await requestElementFullscreen(targetRef.current)
    } catch {
      return false
    }
  }, [supported, targetRef])

  return { supported, isFullscreen, toggleFullscreen }
}
