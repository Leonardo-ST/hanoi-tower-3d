import { useEffect, useState } from 'react'

const PORTRAIT_QUERY = '(orientation: portrait)'
const MOBILE_QUERY = '(hover: none) and (pointer: coarse), (max-width: 600px)'

export function createDeviceLayout(isMobile, isPortrait) {
  return {
    isMobile,
    isPortrait,
    isMobileLandscape: isMobile && !isPortrait,
    showOrientationNotice: isMobile && isPortrait,
  }
}

function readDeviceLayout() {
  if (typeof window === 'undefined') {
    return createDeviceLayout(false, false)
  }

  return createDeviceLayout(
    window.matchMedia(MOBILE_QUERY).matches,
    window.matchMedia(PORTRAIT_QUERY).matches,
  )
}

export default function useDeviceLayout() {
  const [layout, setLayout] = useState(readDeviceLayout)

  useEffect(() => {
    const portraitMedia = window.matchMedia(PORTRAIT_QUERY)
    const mobileMedia = window.matchMedia(MOBILE_QUERY)
    const updateLayout = () => setLayout(createDeviceLayout(mobileMedia.matches, portraitMedia.matches))

    portraitMedia.addEventListener('change', updateLayout)
    mobileMedia.addEventListener('change', updateLayout)
    updateLayout()

    return () => {
      portraitMedia.removeEventListener('change', updateLayout)
      mobileMedia.removeEventListener('change', updateLayout)
    }
  }, [])

  return layout
}
