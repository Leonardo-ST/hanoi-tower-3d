import { formatElapsedTime } from '../utils/gameTimer.js'

export default function VictoryModal({ difficultyName, moves, minimumMoves, elapsedTime, onPlayAgain }) {
  const optimal = moves === minimumMoves
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="victory-title">
      <div className="victory-card">
        <div className="victory-icon" aria-hidden="true">✓</div><p className="eyebrow">Desafio concluído</p>
        <h2 id="victory-title">Você venceu!</h2>
        {optimal && <p className="victory-message perfect">Solução perfeita!</p>}
        <p className="victory-difficulty">Dificuldade: <strong>{difficultyName}</strong></p>
        <div className="victory-stats"><div><span>Tempo</span><strong>{formatElapsedTime(elapsedTime)}</strong></div><div><span>Movimentos</span><strong>{moves}</strong></div><div><span>Mínimo possível</span><strong>{minimumMoves}</strong></div></div>
        <button type="button" onClick={onPlayAgain}>Jogar novamente</button>
      </div>
    </div>
  )
}
