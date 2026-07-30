import React from 'react'
import { Link } from "react-router-dom";  
import './nav.module.css'
import style from './nav.module.css'

const Nav = () => {
  return (
    <div className={style.nav}>
      <div className={style.film}>
        
        <Link to='/'>
          <div className={style.logo}></div>
        </Link>

        <div className={style.user}></div>
        <input type="text" className={style.search} placeholder="Search..." />
        <div className={style.navOpts1} id="navOpt1"></div>
        <Link to='/add'>
          <div className={style.navOpts2} id="navOpt2"></div>
        </Link>
        <Link to='/dashboard'>
          <div className={style.navOpts3} id="navOpt3"></div>
        </Link>

      </div>
    </div>
  )
}

export default Nav