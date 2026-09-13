import { useReducer } from 'react'
import HanoiScene from './HanoiScene.jsx'
import HUD from './HUD.jsx'
import OrientationNotice from './OrientationNotice.jsx'
import StartScreen from './StartScreen.jsx'
import VictoryModal from './VictoryModal.jsx'
import useDeviceLayout from '../hooks/useDeviceLayout.js'
import useHanoiGame from '../hooks/useHanoiGame.js'
import { DIFFICULTIES, gameFlowReducer, getDifficulty, INITIAL_GAME_FLOW } from '../utils/difficulties.js'
import { isValidMove } from '../utils/hanoi.js'

export default function Game() {
  const [flow, dispatch] = useReducer(gameFlowReducer, INITIAL_GAME_FLOW)
  const deviceLayout = useDeviceLayout()
  const difficulty = getDifficulty(flow.difficultyId)
  const isPlaying = flow.screen === 'playing'
  const game = useHanoiGame({ diskCount: difficulty.diskCount, timerPaused: deviceLayout.showOrientationNotice || !isPlaying })
  const validDestinations = game.selectedTower === null
    ? []
    : game.towers.map((_, towerIndex) => isValidMove(game.towers, game.selectedTower, towerIndex))

  const play = () => {
    game.reset()
    dispatch({ type: 'play' })
  }

  const newGame = () => {
    game.reset()
    dispatch({ type: 'new-game' })
  }

  return (
    <main className="game-shell">
      <div className="app-content" inert={deviceLayout.showOrientationNotice ? '' : undefined} aria-hidden={deviceLayout.showOrientationNotice || undefined}>
        {!isPlaying ? (
          <StartScreen difficulties={DIFFICULTIES} selectedDifficultyId={flow.difficultyId} onSelectDifficulty={(difficultyId) => dispatch({ type: 'select-difficulty', difficultyId })} onPlay={play} />
        ) : (
          <div className="game-content">
            <HUD moves={game.moves} minimumMoves={game.minimumMoves} elapsedTime={game.elapsedTime} selectedTower={game.selectedTower} isAnimating={Boolean(game.animation)} onReset={game.reset} onNewGame={newGame} />
            <section className="scene" aria-label="Tabuleiro 3D da Torre de Hanói">
              <HanoiScene diskCount={difficulty.diskCount} isMobile={deviceLayout.isMobile} isMobileLandscape={deviceLayout.isMobileLandscape} towers={game.towers} selectedTower={game.selectedTower} validDestinations={validDestinations} animation={game.animation} invalidFeedback={game.invalidFeedback} won={game.won} onTowerClick={game.selectTower} onAnimationComplete={game.completeMove} />
            </section>
            <div className="tower-controls" aria-label="Controles dos pilares">
              {['Origem', 'Auxiliar', 'Destino'].map((label, index) => (
                <button type="button" key={label} onClick={() => game.selectTower(index)} disabled={Boolean(game.animation) || game.won} className={game.selectedTower === index ? 'is-selected' : ''}>
                  <span>0{index + 1}</span>{label}
                </button>
              ))}
            </div>
            <p className={`feedback ${game.invalidFeedback !== null ? 'is-visible' : ''}`} role="status">
              Movimento inválido — um disco maior não pode ficar sobre um menor.
            </p>
            {game.won && <VictoryModal difficultyName={difficulty.name} moves={game.moves} minimumMoves={game.minimumMoves} elapsedTime={game.finalTime ?? game.elapsedTime} onPlayAgain={game.reset} />}
          </div>
        )}
      </div>
      {deviceLayout.showOrientationNotice && <OrientationNotice />}
    </main>
  )
}
