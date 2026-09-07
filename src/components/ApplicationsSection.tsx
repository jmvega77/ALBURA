type ApplicationsSectionProps = {
  onPersonal: () => void
}

function ApplicationsSection({ onPersonal }: ApplicationsSectionProps) {
  return (
    <section className="apps-section">
      <div className="section-heading">
        <div>
          <span className="section-kicker">TRABAJO</span>
          <h2>Mis aplicaciones</h2>
        </div>

        <button className="text-button">
          Ver todas
          <span>→</span>
        </button>
      </div>

      <div className="apps-grid">
        <button className="app-card" onClick={onPersonal}>
          <div className="app-card-top">
            <div className="app-icon blue-icon">●</div>
            <span className="app-arrow">→</span>
          </div>

          <strong>Personal</strong>
          <span>Personas, permisos y jornada</span>
        </button>

        <button className="app-card">
          <div className="app-card-top">
            <div className="app-icon green-icon">▥</div>
            <span className="app-arrow">→</span>
          </div>

          <strong>Explotación EDAR</strong>
          <span>Instalaciones y variables</span>
        </button>

        <button className="app-card">
          <div className="app-card-top">
            <div className="app-icon purple-icon">⚒</div>
            <span className="app-arrow">→</span>
          </div>

          <strong>Mantenimiento</strong>
          <span>OT, preventivos y activos</span>
        </button>

        <button className="app-card">
          <div className="app-card-top">
            <div className="app-icon cyan-icon">▣</div>
            <span className="app-arrow">→</span>
          </div>

          <strong>Vehículos</strong>
          <span>Flota, ITV y mantenimiento</span>
        </button>

        <button className="app-card">
          <div className="app-card-top">
            <div className="app-icon orange-icon">◇</div>
            <span className="app-arrow">→</span>
          </div>

          <strong>Almacén</strong>
          <span>Inventario y stock</span>
        </button>

        <button className="app-card">
          <div className="app-card-top">
            <div className="app-icon navy-icon">▤</div>
            <span className="app-arrow">→</span>
          </div>

          <strong>Compras</strong>
          <span>Proveedores y pedidos</span>
        </button>
      </div>
    </section>
  )
}

export default ApplicationsSection
