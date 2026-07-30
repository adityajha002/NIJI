import React from 'react'
import style from './section1.module.css'
import Cat_nav from './sec1a/cat_nav.jsx'
import Sec1bhead from './sec1b/sec1bhead.jsx'


const Section1 = ({ category, setCategory }) => {
  return (
    <div className={style.section1}>
      <Cat_nav category={category} setCategory={setCategory} />
      <Sec1bhead message="SHOPS" />
    </div>
  )
}

export default Section1
