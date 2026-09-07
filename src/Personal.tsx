import './Personal.css'

type PersonalProps = {
  onBack: () => void
}

function Personal({ onBack }: PersonalProps) {
  return (
    <div className="personal-app">
      <header className="personal-header">
        <button className="personal-back" onClick={onBack}>
          ← Inicio
        </button>

        <div className="personal-title">
          <span className="personal-kicker">ALBURA · PERSONAL</span>
          <h1>Personal</h1>
          <p>Personas, permisos y jornada</p>
        </div>
      </header>

      <main className="personal-content">
        <nav className="personal-nav" aria-label="Secciones de Personal">
          <button className="personal-nav-item active">Personal</button>
          <button className="personal-nav-item">Jornada</button>
          <button className="personal-nav-item">Vacaciones</button>
          <button className="personal-nav-item">Horas extra</button>
          <button className="personal-nav-item">Ausencias</button>
        </nav>

        <section className="people-section">
          <div className="people-heading">
            <div>
              <span className="personal-kicker">PERSONAL</span>
              <h2>Personas</h2>
              <p>Gestiona las personas que forman parte de ALBURA.</p>
            </div>

            <button className="add-person-button">+ Añadir persona</button>
          </div>

          <div className="people-toolbar">
            <label className="people-search">
              <span>⌕</span>
              <input type="search" placeholder="Buscar persona..." />
            </label>

            <button className="filter-button">Todos los estados⌄</button>
          </div>

          <div className="people-empty">
            <div className="people-empty-icon">●</div>
            <h3>Aún no hay personas cargadas</h3>
            <p>
              Las personas serán la base de Personal. Desde aquí podremos
              gestionar sus cargos, funciones, perfiles y permisos.
            </p>
            <button className="empty-action">Añadir primera persona</button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Personal
