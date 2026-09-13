import { formatElapsedTime } from '../utils/gameTimer.js'

export default function HUD({ moves, minimumMoves, elapsedTime, selectedTower, isAnimating, onReset, onNewGame }) {
  const status = isAnimating ? 'Movendo disco…' : selectedTower !== null ? 'Agora escolha o destino' : 'Escolha um pilar'
  return (
    <header className="hud">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true"><i /><i /><i /></div>
        <div><p>Quebra-cabeça clássico</p><h1>Torre de Hanói</h1></div>
      </div>
      <div className="stats" aria-label="Estatísticas da partida">
        <div><span>Movimentos</span><strong>{String(moves).padStart(2, '0')}</strong></div>
        <div><span>Mínimo</span><strong>{String(minimumMoves).padStart(2, '0')}</strong></div>
        <div><span>Tempo</span><strong>{formatElapsedTime(elapsedTime)}</strong></div>
      </div>
      <div className="hud-actions">
        <p><span className="status-dot" />{status}</p>
        <button className="secondary-action" type="button" onClick={onNewGame} aria-label="Voltar à tela inicial e começar um novo jogo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h10M4 18h16" /></svg>Novo jogo
        </button>
        <button type="button" onClick={onReset} aria-label="Reiniciar jogo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.34 5.66M20 4v7h-7" /></svg>Reiniciar
        </button>
      </div>
    </header>
  )
}
