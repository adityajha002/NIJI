import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home/home.jsx'
import Add from './pages/add/add.jsx'
import Auth from './pages/auth/auth.jsx'
import Test from './pages/test/test.jsx'
import { AuthProvider } from './context/authContext.jsx'
import ProtectedRoute from './components/protectedRoutes/protectedRoutes.jsx'
import Dashboard from './pages/dashboard/dashboard.jsx'
function App() {

  return (
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<ProtectedRoute role="shop" />}>
              <Route path="/add" element={<Add />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="/auth" element={<Auth />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </AuthProvider>
      </Router>
  )
}

export default App
