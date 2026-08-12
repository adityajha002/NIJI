import { useState } from 'react'
import style from './section1.module.css'
import Cat_nav from './sec1a/cat_nav'
import Sec1bhead from './sec1b/sec1bhead'
import Sec1b from './sec1b/sec1b'


const Section1 = () => {
  const [category, setCategory] = useState("All");

  return (
    <div className={style.section1}>
      <Cat_nav category={category} setCategory={setCategory} />
      <Sec1bhead message="SHOPS" />
      <Sec1b category={category} />
    </div>
  )
}

export default Section1
