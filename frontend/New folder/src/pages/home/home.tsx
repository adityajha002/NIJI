import { useState } from 'react'
import Nav from '../../components/nav/nav.js'
import Section1 from '../../components/section1/section1.js'
import Section2 from '../../components/section2/section2.js'
import Footer from '../../components/footer/footer.js'
import style from './home.module.css'
import SideMenu from '../../components/sideMenu/sideMenu.js'

function Home() {
  const [sideMenu, setSideMenu] = useState(false);
  return (
    <div className={style.main}>
      <Nav setSideMenu={setSideMenu}/>
      <div className={style.filmWrapper}>
        <div className={style.film}>
          <Section1 />  
          <Section2 />
          <SideMenu isOpen={sideMenu} />
        </div>
      </div>
          <Footer />
    </div>
  )
}

export default Home
