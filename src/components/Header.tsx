import { useEffect, useState } from 'react'

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

function Header() {
  const [currentTime, setCurrentTime] = useState(() => new Date())
  const [weather, setWeather] = useState<WeatherData | null>(null)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

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

  const formattedTime = currentTime.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
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
          {formattedTime}
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

      <span className="environment-badge">DESARROLLO</span>
    </header>
  )
}

export default Header
