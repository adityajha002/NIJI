import { useState } from 'react'
import Nav from '../../components/nav/nav.jsx'
import Section1 from '../../components/section1/section1.jsx'
import Section2 from '../../components/section2/section2.jsx'
import style from './home.module.css'

function Home() {
  const [category, setCategory] = useState("All");
  return (
    <div className={style.main}>
      <Nav />
      <div className={style.filmWrapper}>
        <div className={style.film}>
          <Section1 category={category} setCategory={setCategory} />  
          <Section2 />
        </div>
      </div>
    </div>
  )
}

export default Home
