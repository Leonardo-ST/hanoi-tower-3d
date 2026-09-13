import { formatElapsedTime } from '../utils/gameTimer.js'

export default function HUD({ moves, minimumMoves, elapsedTime, selectedTower, isAnimating, onReset, onNewGame, showFullscreen, isFullscreen, onToggleFullscreen }) {
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
        {showFullscreen && (
          <button className={`secondary-action fullscreen-action ${isFullscreen ? 'is-active' : ''}`} type="button" onClick={onToggleFullscreen} aria-label={isFullscreen ? 'Sair da tela cheia' : 'Entrar em tela cheia'} aria-pressed={isFullscreen}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {isFullscreen
                ? <path d="M8 3v5H3M16 3v5h5M8 21v-5H3M16 21v-5h5" />
                : <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />}
            </svg>
            {isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
          </button>
        )}
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
