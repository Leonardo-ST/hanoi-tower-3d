export default function StartScreen({ difficulties, selectedDifficultyId, onSelectDifficulty, onPlay }) {
  return (
    <section className="start-screen" aria-labelledby="start-title">
      <div className="start-card">
        <div className="start-brand" aria-hidden="true">
          <div className="brand-mark"><i /><i /><i /></div>
        </div>
        <p className="eyebrow">Quebra-cabeça clássico</p>
        <h1 id="start-title">Torre de Hanói</h1>
        <p className="start-description">Mova toda a torre para o último pilar sem colocar um disco maior sobre um menor.</p>

        <div className="difficulty-options" role="radiogroup" aria-label="Selecione a dificuldade">
          {difficulties.map((difficulty) => {
            const selected = difficulty.id === selectedDifficultyId
            return (
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                className={selected ? 'difficulty-option is-selected' : 'difficulty-option'}
                key={difficulty.id}
                onClick={() => onSelectDifficulty(difficulty.id)}
              >
                <strong>{difficulty.name}</strong>
                <span>{difficulty.diskCount} discos</span>
              </button>
            )
          })}
        </div>

        <button className="play-button" type="button" onClick={onPlay}>Jogar</button>
      </div>
    </section>
  )
}
