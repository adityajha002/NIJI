import React from 'react'
import style from './sec1b.module.css'

const Sec1bhead = (props) => {
  return (
    <div className={style.sec1bhead}>
       DISCOVER YOUR NEARBY {props.message} WITH NIJI !
    </div>
  )
}

export default Sec1bhead
