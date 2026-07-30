import React from 'react'
import style from "./sideMenu.module.css"
import {useAuth} from "../../context/useAuth.js"
import { Link } from "react-router-dom";  
import { useNavigate } from "react-router-dom";
const SideMenu = ({ isOpen }) => {
      const {user,token,logout} = useAuth();
      const navigate = useNavigate();
      const userLogout = () => {
            logout();
            navigate("/auth", { replace: true });
      }
  return (
    <div className={`${style.main} ${isOpen ? style.open : ""}`}>
      <div className={style.film}>
            {user?<div className={style.menuOption} ><div onClick={userLogout} style={{textDecoration:"none"}}> LOGOUT </div></div>:<Link to="/auth" style={{textDecoration:"none"}}><div className={style.menuOption} style={{textDecoration:"none"}}> LOGIN </div></Link>}
            {user?.role === "user" ? <Link to="/add" style={{textDecoration:"none"}}><div className={style.menuOption}> ADD YOUR SHOP</div></Link> : null}
            {user?<Link style={{textDecoration:"none"}}><div className={style.menuOption}> INBOX </div></Link>:<div></div>}
            {user?<Link to="/redirect-to-profile" style={{textDecoration:"none"}}><div className={style.menuOption} > PROFILE </div></Link>:<div></div>}
      </div>
    </div>
  )
}

export default SideMenu
