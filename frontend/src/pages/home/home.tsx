import { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NearbyShops from './components/NearbyShops/NearbyShops';
import WhyNiji from './components/WhyNiji/WhyNiji';
import Footer from '../../components/footer/footer';
import style from './home.module.css';
import SideMenu from '../../components/sideMenu/sideMenu';

function Home() {
  const [sideMenu, setSideMenu] = useState(false);
  return (
    <div className={style.main}>
      <Navbar setSideMenu={setSideMenu}/>
      <div className={style.filmWrapper}>
        <div className={style.film}>
          <NearbyShops />  
          <WhyNiji />
          <SideMenu isOpen={sideMenu} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
