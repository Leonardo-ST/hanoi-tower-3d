import test from 'node:test'
import assert from 'node:assert/strict'
import { DIFFICULTIES, gameFlowReducer, getDifficulty, INITIAL_GAME_FLOW } from '../src/utils/difficulties.js'
import { createInitialTowers, getMinimumMoves, hasWon } from '../src/utils/hanoi.js'

test('configura dificuldades e mínimos automaticamente', () => {
  assert.deepEqual(DIFFICULTIES.map(({ name, diskCount }) => [name, diskCount]), [['Fácil', 3], ['Normal', 4], ['Difícil', 5], ['Expert', 8]])
  assert.deepEqual(DIFFICULTIES.map(({ diskCount }) => getMinimumMoves(diskCount)), [7, 15, 31, 255])
})

test('gera torres com três, quatro, cinco, seis e oito discos', () => {
  for (const count of [3, 4, 5, 6, 8]) assert.equal(createInitialTowers(count)[0].length, count)
})

test('troca dificuldade, inicia e retorna ao menu', () => {
  const selected = gameFlowReducer(INITIAL_GAME_FLOW, { type: 'select-difficulty', difficultyId: 'hard' })
  assert.equal(getDifficulty(selected.difficultyId).diskCount, 5)
  assert.equal(gameFlowReducer(selected, { type: 'play' }).screen, 'playing')
  assert.equal(gameFlowReducer({ ...selected, screen: 'playing' }, { type: 'new-game' }).screen, 'menu')
})

test('detecta vitória em outra dificuldade', () => {
  assert.equal(hasWon([[], [], [3, 2, 1]], 3), true)
  assert.equal(hasWon([[], [1], [3, 2]], 3), false)
})
