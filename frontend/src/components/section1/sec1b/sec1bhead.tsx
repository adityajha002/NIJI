import React from 'react'
import style from './sec1b.module.css'

interface props {
  message: string;
}
const Sec1bhead = ({ message }: props) => {
  return (
    <div className={style.sec1bhead}>
      DISCOVER YOUR NEARBY {message} WITH NIJI !
    </div>
  )
}

export default Sec1bhead
