import test from 'node:test'
import assert from 'node:assert/strict'
import { createDeviceLayout } from '../src/hooks/useDeviceLayout.js'

test('bloqueia somente dispositivos móveis em retrato', () => {
  assert.equal(createDeviceLayout(true, true).showOrientationNotice, true)
  assert.equal(createDeviceLayout(false, true).showOrientationNotice, false)
  assert.equal(createDeviceLayout(true, false).showOrientationNotice, false)
})

test('responde à sequência retrato e paisagem sem recarregar', () => {
  const layouts = [true, false, true, false].map((portrait) => createDeviceLayout(true, portrait))
  assert.deepEqual(layouts.map((layout) => layout.showOrientationNotice), [true, false, true, false])
  assert.deepEqual(layouts.map((layout) => layout.isMobileLandscape), [false, true, false, true])
})
