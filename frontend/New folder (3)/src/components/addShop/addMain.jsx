import React from 'react'
import style from './addMain.module.css'
import AddShopSec2 from './addShopSec2/addShopSec2.jsx'
import AddShopSec1 from './addShopsSec1/addShopSec1.jsx'

const AddMain = () => {
  return (
    <div className={style.main}>
      <AddShopSec1 />
    </div>
  )
}

export default AddMain
