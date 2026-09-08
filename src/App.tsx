import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import AttentionSection from './components/AttentionSection'
import ApplicationsSection from './components/ApplicationsSection'
import WelcomeSection from './components/WelcomeSection'
import Personal from './Personal'

// App es el punto de entrada de la interfaz de ALBURA.
// Mantiene la navegación principal entre la pantalla de inicio
// y las aplicaciones que se vayan incorporando a la plataforma.
function App() {
  // Por ahora la navegación se controla localmente.
  // Más adelante podrá sustituirse por el sistema de navegación
  // que corresponda cuando la plataforma crezca.
  const [activeView, setActiveView] = useState<'home' | 'personal'>('home')

  // Personal es actualmente la primera aplicación conectada
  // al inicio de ALBURA. onBack devuelve al panel principal.
  if (activeView === 'personal') {
    return <Personal onBack={() => setActiveView('home')} />
  }

  return (
    <div className="albura-app">
      <Header />

      <main className="main-content">
        {/* Presentación inicial del panel de trabajo. */}
        <WelcomeSection />

        {/* Asuntos que requieren atención en el día actual. */}
        <AttentionSection onPersonal={() => setActiveView('personal')} />

        {/* Aplicaciones disponibles desde el panel principal. */}
        <ApplicationsSection onPersonal={() => setActiveView('personal')} />
      </main>
    </div>
  )
}

export default App
