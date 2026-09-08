type AttentionSectionProps = {
  onPersonal: () => void
}

// Panel de asuntos que requieren atención desde la pantalla principal.
// Actualmente contiene datos de demostración; posteriormente estos datos
// procederán de las aplicaciones correspondientes.
function AttentionSection({ onPersonal }: AttentionSectionProps) {
  return (
    <section className="attention-section">
      <div className="section-heading">
        <div>
          <span className="section-kicker">HOY</span>
          <h2>Esto requiere tu atención</h2>
        </div>

        <span className="attention-count">3 asuntos</span>
      </div>

      <div className="attention-grid">
        <article className="attention-card danger">
          <div className="card-top">
            <div className="card-icon">✓</div>
            <span className="priority-label">REVISIÓN</span>
          </div>

          <div className="card-content">
            <strong>3 OT necesitan revisión</strong>
            <span>Mantenimiento</span>
          </div>

          <button className="card-action">
            Ir a Mantenimiento
            <span>→</span>
          </button>
        </article>

        <article className="attention-card warning">
          <div className="card-top">
            <div className="card-icon">●</div>
            <span className="priority-label">PENDIENTE</span>
          </div>

          <div className="card-content">
            <strong>1 solicitud pendiente</strong>
            <span>Personal</span>
          </div>

          <button className="card-action" onClick={onPersonal}>
            Ir a Personal
            <span>→</span>
          </button>
        </article>

        <article className="attention-card notice">
          <div className="card-top">
            <div className="card-icon">▣</div>
            <span className="priority-label">PRÓXIMO</span>
          </div>

          <div className="card-content">
            <strong>ITV de furgoneta en 12 días</strong>
            <span>Vehículos</span>
          </div>

          <button className="card-action">
            Ir a Vehículos
            <span>→</span>
          </button>
        </article>
      </div>
    </section>
  )
}

export default AttentionSection
