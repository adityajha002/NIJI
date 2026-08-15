import { useState, useEffect } from 'react';
import style from './WhyNiji.module.css';
import videoSrc from '../../../../assets/videos/OIG2.mp4';

const VideoCard = () => {
  const [mobile, setMobile] = useState(window.innerWidth < 868);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 868);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={style.videoCards}>
      {mobile ? "" : (
        <video className={style.video} autoPlay loop muted>
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
      <div className={style.detailContainer}>
        <h1 className={style.detailHeading}> BUT WHY TO USE NIJI?</h1>
        <div className={style.detail}>
          <p>
            Local markets are full of great products, but finding exactly what you need can be frustrating. NIJI removes the guesswork by connecting you directly to nearby shops that have what you're looking for.
          </p>
          <div className={style.miniSearch}>
            <div className={style.searchIcon1}></div> Search the product you need to find before your shoping 
          </div>
          <div className={style.miniSearch}>
            <div className={style.searchIcon2}></div>We will find that product nearest to your location
          </div>
          <div className={style.miniSearch}>
            <div className={style.searchIcon3}></div>You bargain with the price, get the location of the store
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
