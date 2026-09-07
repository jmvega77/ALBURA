import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import AttentionSection from './components/AttentionSection'
import ApplicationsSection from './components/ApplicationsSection'
import WelcomeSection from './components/WelcomeSection'
import Personal from './Personal'

function App() {
  const [activeView, setActiveView] = useState<'home' | 'personal'>('home')

  if (activeView === 'personal') {
    return <Personal onBack={() => setActiveView('home')} />
  }

  return (
    <div className="albura-app">
      <Header />

      <main className="main-content">
        <WelcomeSection />

        <AttentionSection />

        <ApplicationsSection onPersonal={() => setActiveView('personal')} />
      </main>
    </div>
  )
}

export default App
