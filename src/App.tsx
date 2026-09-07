import './App.css'
import Header from './components/Header'

function App() {
  return (
    <div className="albura-app">
      <Header />

      <main className="main-content">
        <section className="welcome-section">
          <span className="welcome-label">HOY</span>

          <h1>Buenos días, Chete</h1>

          <p>Esto es lo que requiere tu atención hoy</p>
        </section>

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

              <button className="card-action">
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
            <button className="app-card">
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
      </main>
    </div>
  )
}

export default App
