import React from 'react'
import style from './sec1a.module.css'

const Cat_opt = ({ Name, className = "", onClick, category }) => {
  return (
    <div className={`${style.cat_opt} ${className} ${Name === category ? style.active : ""}`.trim()} onClick={onClick}>
      {Name}
    </div>
  )
}

export default Cat_opt
