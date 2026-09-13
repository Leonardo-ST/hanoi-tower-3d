export default function OrientationNotice() {
  return (
    <div className="orientation-notice" role="dialog" aria-modal="true" aria-labelledby="orientation-title">
      <div className="orientation-icon" aria-hidden="true">
        <span className="orientation-phone" />
      </div>
      <h2 id="orientation-title">Gire seu dispositivo</h2>
      <p>Para jogar Torre de Hanói, use o celular na horizontal.</p>
    </div>
  )
}
