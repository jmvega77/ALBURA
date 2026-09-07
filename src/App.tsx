import './App.css'
import Header from './components/Header'
import AttentionSection from './components/AttentionSection'
import ApplicationsSection from './components/ApplicationsSection'
import WelcomeSection from './components/WelcomeSection'

function App() {
  return (
    <div className="albura-app">
      <Header />

      <main className="main-content">
        <WelcomeSection />

        <AttentionSection />

        <ApplicationsSection />
      </main>
    </div>
  )
}

export default App
