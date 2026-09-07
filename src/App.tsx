import { useEffect, useState } from 'react'
import './App.css'

type WeatherData = {
  temperature: number
  weatherCode: number
}

function getWeatherIcon(code: number) {
  if (code === 0) return '☀️'
  if (code === 1 || code === 2) return '🌤️'
  if (code === 3) return '☁️'
  if (code === 45 || code === 48) return '🌫️'
  if (code >= 51 && code <= 57) return '🌦️'
  if (code >= 61 && code <= 67) return '🌧️'
  if (code >= 71 && code <= 77) return '🌨️'
  if (code >= 80 && code <= 82) return '🌧️'
  if (code >= 85 && code <= 86) return '🌨️'
  if (code >= 95 && code <= 99) return '⛈️'

  return '🌤️'
}

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`,
          )

          if (!response.ok) return

          const data = await response.json()

          setWeather({
            temperature: Math.round(data.current.temperature_2m),
            weatherCode: data.current.weather_code,
          })
        } catch {
          // Si falla el servicio meteorológico,
          // la cabecera continúa funcionando normalmente.
        }
      },
      () => {
        // El usuario puede denegar la ubicación.
        // En ese caso simplemente no mostramos el tiempo.
      },
    )
  }, [])

  return (
    <div className="albura-app">
      <header className="main-header">
        <div className="albura-brand">
          <img
            src="/ALBURA_logo_transparente.png"
            className="albura-logo"
            alt="ALBURA"
          />
        </div>

        <div className="header-actions">
          <button className="header-action" title="Notificaciones">
            ♧
          </button>

          <button className="header-action" title="Ajustes">
            ⚙
          </button>

          <div className="current-time">
            07:32
          </div>

          {weather && (
            <div className="weather-area" title="Tiempo en tu ubicación actual">
              <span className="weather-icon">
                {getWeatherIcon(weather.weatherCode)}
              </span>

              <span className="weather-temperature">
                {weather.temperature} °C
              </span>
            </div>
          )}

          <div className="user-area">
            <div className="user-avatar">C</div>

            <div className="user-info">
              <strong>Chete</strong>
              <span>Jefe de Planta</span>
            </div>

            <span className="user-arrow">⌄</span>
          </div>
        </div>
      </header>

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