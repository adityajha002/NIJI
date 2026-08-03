import React from 'react'
import { Link } from "react-router-dom";  
import './nav.module.css'
import style from './nav.module.css'
import {useAuth} from '../../context/useAuth'

interface NavProps {
  setSideMenu?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Nav: React.FC<NavProps> = ({ setSideMenu }) => {

  const {user,token} = useAuth();
  
  const openSideMenu = () => {
    setSideMenu?.((isOpen) => !isOpen);
  }

  return (
    <div className={style.nav}>
      <div className={style.film}>
        <Link to='/' className={style.logoLink}>
          <div className={style.logo}></div>
        </Link>

        <div className={style.searchWrapper}>
          <input type="text" className={style.search} placeholder="Search..." />
        </div>

        <div className={style.navActions}>
            <Link to="/" style={{textDecoration:"none"}}><div className={style.navOpts1}>INBOX</div></Link>
            { user ? (
              <Link to="/redirect-to-profile" style={{textDecoration:"none"}}><div className={style.navOpts2}>PROFILE</div></Link>
            ) : (
              <Link to="/auth" style={{textDecoration:"none"}}><div className={style.login}>LOGIN</div></Link>
            )}
            { user ? (
              <div className={style.menuBtn} onClick={openSideMenu}>MENU</div>
            ) : null}
          
        </div>
      </div>
    </div>
  )
}

export default Nav
