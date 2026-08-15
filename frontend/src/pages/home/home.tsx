import { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import NearbyShops from './components/NearbyShops/NearbyShops';
import WhyNiji from './components/WhyNiji/WhyNiji';
import Footer from '../../components/Footer/Footer';
import style from './Home.module.css';
import SideMenu from '../../components/SideMenu/SideMenu';

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
