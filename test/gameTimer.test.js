import test from 'node:test'
import assert from 'node:assert/strict'
import { createTimerState, finishTimer, formatElapsedTime, getElapsedTime, pauseTimer, resumeTimer, startTimer } from '../src/utils/gameTimer.js'

test('permanece parado até o primeiro movimento válido', () => {
  const initial = createTimerState()
  assert.equal(getElapsedTime(initial, 5000), 0)
  const started = startTimer(initial, 5000)
  assert.equal(getElapsedTime(started, 6750), 1750)
})

test('pausa e retoma preservando o tempo acumulado', () => {
  const paused = pauseTimer(startTimer(createTimerState(), 1000), 3500)
  assert.equal(getElapsedTime(paused, 9000), 2500)
  assert.equal(getElapsedTime(resumeTimer(paused, 10000), 11500), 4000)
})

test('congela e formata o tempo final', () => {
  const finished = finishTimer(startTimer(createTimerState(), 2000), 200000)
  assert.equal(getElapsedTime(finished, 999000), 198000)
  assert.equal(formatElapsedTime(finished.finalTime), '03:18')
  assert.equal(formatElapsedTime(42000), '00:42')
})

test('reiniciar cria um cronômetro zerado e parado', () => {
  assert.deepEqual(createTimerState(), { startedAt: null, elapsedTime: 0, isRunning: false, finalTime: null, hasStarted: false })
})
