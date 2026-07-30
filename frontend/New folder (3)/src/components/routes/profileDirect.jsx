import React from 'react'
import {useAuth} from '../../context/useAuth.js';
import {Navigate} from 'react-router-dom'
import ShopDashboard from '../../pages/dashboard/dashboard.jsx';

const profileDirect = () => {
      const {user} = useAuth();

      if (!user) return <Navigate to='/auth'/>
      if (user.role==='shop') return <Navigate to='/dashboard'/>
      if (user.role==='user') return <Navigate to='/profile'/>
  return (
    <div>
      
    </div>
  )
}

export default profileDirect
