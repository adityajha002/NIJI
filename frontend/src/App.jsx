import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home/home.jsx'
import Add from './pages/add/add.jsx'
import Auth from './pages/auth/auth.jsx'
import { AuthProvider } from './context/authContext.jsx'
import ProtectedRoute from './components/protectedRoutes/protectedRoutes.jsx'
import Dashboard from './pages/dashboard/dashboard.jsx'
import ShopEdit from './pages/edit/shopEdit.jsx';
import ShopView from './pages/view/shop/shopView.jsx'
import UserDashbord from './pages/userDashboard/user.jsx'
import ProfileDirect from './components/routes/profileDirect.jsx'

function App() {

  return (
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<ProtectedRoute role="user" />}>
              <Route path="/add" element={<Add />} />
              <Route path="/profile" element={<UserDashbord/>}/>
            </Route>
            <Route element={<ProtectedRoute role="shop" />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/shop-edit" element={<ShopEdit />} />
            </Route>
            <Route path="/shops/:id" element={<ShopView />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/redirect-to-profile" element={<ProfileDirect />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </AuthProvider>
      </Router>
  )
}

export default App
