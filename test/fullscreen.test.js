import test from 'node:test'
import assert from 'node:assert/strict'
import { exitDocumentFullscreen, getFullscreenElement, isFullscreenSupported, requestElementFullscreen } from '../src/utils/fullscreen.js'

test('detecta suporte apenas quando entrada e saída de fullscreen estão disponíveis', () => {
  assert.equal(isFullscreenSupported({}, {}), false)
  assert.equal(isFullscreenSupported({ requestFullscreen() {} }, {}), false)
  assert.equal(isFullscreenSupported({ requestFullscreen() {} }, { exitFullscreen() {} }), true)
  assert.equal(isFullscreenSupported({ webkitRequestFullscreen() {} }, { webkitExitFullscreen() {} }), true)
  assert.equal(isFullscreenSupported({ webkitRequestFullScreen() {} }, { webkitCancelFullScreen() {} }), true)
})

test('usa o elemento fullscreen real como fonte de estado', () => {
  const element = {}
  assert.equal(getFullscreenElement({ fullscreenElement: element }), element)
  assert.equal(getFullscreenElement({ webkitFullscreenElement: element }), element)
  assert.equal(getFullscreenElement({ webkitCurrentFullScreenElement: element }), element)
  assert.equal(getFullscreenElement({}), null)
})

test('entra e sai de fullscreen pelas APIs padrão', async () => {
  let requested = false
  let exited = false
  const element = { requestFullscreen() { requested = this === element } }
  const documentRef = { exitFullscreen() { exited = this === documentRef } }

  assert.equal(await requestElementFullscreen(element), true)
  assert.equal(await exitDocumentFullscreen(documentRef), true)
  assert.equal(requested, true)
  assert.equal(exited, true)
})

test('usa fallback WebKit e falha com segurança sem suporte', async () => {
  let requested = false
  let exited = false
  const element = { webkitRequestFullscreen() { requested = true } }
  const documentRef = { webkitExitFullscreen() { exited = true } }

  assert.equal(await requestElementFullscreen(element), true)
  assert.equal(await exitDocumentFullscreen(documentRef), true)
  assert.equal(requested, true)
  assert.equal(exited, true)
  assert.equal(await requestElementFullscreen({}), false)
  assert.equal(await exitDocumentFullscreen({}), false)
})
