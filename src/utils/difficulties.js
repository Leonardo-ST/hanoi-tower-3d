export const DIFFICULTIES = [
  { id: 'easy', name: 'Fácil', diskCount: 3 },
  { id: 'normal', name: 'Normal', diskCount: 4 },
  { id: 'hard', name: 'Difícil', diskCount: 5 },
  { id: 'expert', name: 'Expert', diskCount: 8 },
]

export const INITIAL_GAME_FLOW = { screen: 'menu', difficultyId: 'normal' }

export function gameFlowReducer(state, action) {
  if (action.type === 'select-difficulty') {
    return DIFFICULTIES.some((difficulty) => difficulty.id === action.difficultyId)
      ? { ...state, difficultyId: action.difficultyId }
      : state
  }
  if (action.type === 'play') return { ...state, screen: 'playing' }
  if (action.type === 'new-game') return { ...state, screen: 'menu' }
  return state
}

export function getDifficulty(difficultyId) {
  return DIFFICULTIES.find((difficulty) => difficulty.id === difficultyId) ?? DIFFICULTIES[1]
}
