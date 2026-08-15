import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home/home';
import AddShop from '../pages/AddShop/AddShop';
import Auth from '../pages/auth/auth';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '../pages/dashboard/dashboard';
import EditShop from '../pages/EditShop/EditShop';
import ShopView from '../pages/Shop/ShopView';
import UserDashboard from '../pages/UserDashboard/UserDashboard'; 
import ProfileRoute from './ProfileRoute';
import Search from '../pages/search/search'; 
import ProductView from '../pages/product/productView'; 

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<ProtectedRoute role="user" />}>
        <Route path="/add" element={<AddShop />} />
        <Route path="/profile" element={<UserDashboard />} />
      </Route>
      <Route path="/search" element={<Search />} />
      <Route path="/search/:searchTerm" element={<Search />} />
      <Route path="/products/:productId" element={<ProductView />} />
      <Route element={<ProtectedRoute role="shop" />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/shop-edit" element={<EditShop />} />
      </Route>
      <Route path="/shops/:id" element={<ShopView />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/redirect-to-profile" element={<ProfileRoute />} />
    </Routes>
  );
};

export default AppRoutes;
