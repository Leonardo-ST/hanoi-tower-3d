import test from 'node:test'
import assert from 'node:assert/strict'
import { createInitialTowers, getMinimumMoves, hasWon, isValidMove, moveDisk } from '../src/utils/hanoi.js'

test('cria discos na ordem correta e calcula o mínimo', () => {
  assert.deepEqual(createInitialTowers(5), [[5, 4, 3, 2, 1], [], []])
  assert.equal(getMinimumMoves(5), 31)
})

test('move somente o topo sem alterar o original', () => {
  const towers = createInitialTowers(5)
  assert.deepEqual(moveDisk(towers, 0, 2), [[5, 4, 3, 2], [], [1]])
  assert.deepEqual(towers, [[5, 4, 3, 2, 1], [], []])
})

test('impede disco maior sobre menor sem mudar o estado', () => {
  const towers = [[5, 4, 3], [], [2, 1]]
  assert.equal(isValidMove(towers, 0, 2), false)
  assert.equal(moveDisk(towers, 0, 2), towers)
})

test('detecta vitória somente no terceiro pilar', () => {
  assert.equal(hasWon([[], [], [5, 4, 3, 2, 1]], 5), true)
  assert.equal(hasWon([[], [1], [5, 4, 3, 2]], 5), false)
})

test('conclui uma solução mínima completa', () => {
  const solution = []
  const solve = (count, source, destination, auxiliary) => {
    if (!count) return
    solve(count - 1, source, auxiliary, destination)
    solution.push([source, destination])
    solve(count - 1, auxiliary, destination, source)
  }
  solve(5, 0, 2, 1)
  let towers = createInitialTowers(5)
  for (const [source, destination] of solution) towers = moveDisk(towers, source, destination)
  assert.equal(solution.length, getMinimumMoves(5))
  assert.equal(hasWon(towers, 5), true)
})
