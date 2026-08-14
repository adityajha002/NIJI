import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home/home'
import Add from './pages/add/add'
import Auth from './pages/auth/auth'
import { AuthProvider } from './context/authContext'
import ProtectedRoute from './components/protectedRoutes/protectedRoutes'
import Dashboard from './pages/dashboard/dashboard'
import ShopEdit from './pages/edit/shopEdit';
import ShopView from './pages/view/shop/shopView'
import UserDashbord from './pages/userDashboard/user'
import ProfileDirect from './components/routes/profileDirect'
import Search from './pages/search/search'
import ProductView from './pages/product/productView'
function App() {

  return (
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<ProtectedRoute role="user" />}>
              <Route path="/add" element={<Add />} />
              <Route path="/profile" element={<UserDashbord onBack={() => {}} />}/>
            </Route>
            <Route path="/search" element={<Search />} />
            <Route path="/search/:searchTerm" element={<Search />} />
            <Route path="/products/:productId" element={<ProductView />} />
            <Route element={<ProtectedRoute role="shop" />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/shop-edit" element={<ShopEdit />} />
            </Route>
            <Route path="/shops/:id" element={<ShopView />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/redirect-to-profile" element={<ProfileDirect />} />
          </Routes>
        </AuthProvider>
      </Router>
  )
}

export default App
