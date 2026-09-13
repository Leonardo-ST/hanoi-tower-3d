export function getFullscreenElement(documentRef) {
  return documentRef.fullscreenElement ?? documentRef.webkitFullscreenElement ?? documentRef.webkitCurrentFullScreenElement ?? null
}

export function isFullscreenSupported(element, documentRef) {
  const canEnter = Boolean(element?.requestFullscreen || element?.webkitRequestFullscreen || element?.webkitRequestFullScreen)
  const canExit = Boolean(documentRef?.exitFullscreen || documentRef?.webkitExitFullscreen || documentRef?.webkitCancelFullScreen)
  return canEnter && canExit
}

export function requestElementFullscreen(element) {
  const request = element?.requestFullscreen ?? element?.webkitRequestFullscreen ?? element?.webkitRequestFullScreen
  if (!request) return Promise.resolve(false)
  return Promise.resolve(request.call(element)).then(() => true)
}

export function exitDocumentFullscreen(documentRef) {
  const exit = documentRef?.exitFullscreen ?? documentRef?.webkitExitFullscreen ?? documentRef?.webkitCancelFullScreen
  if (!exit) return Promise.resolve(false)
  return Promise.resolve(exit.call(documentRef)).then(() => true)
}
