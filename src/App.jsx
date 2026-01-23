import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import ThemeToggle from './components/ThemeToggle'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-surface border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-xl font-bold text-primary-500">
                IES El Rincón
              </Link>
              <Link to="/dashboard" className="text-text-secondary hover:text-text-primary">
                Dashboard
              </Link>
              <Link to="/login" className="text-text-secondary hover:text-text-primary">
                Login
              </Link>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
