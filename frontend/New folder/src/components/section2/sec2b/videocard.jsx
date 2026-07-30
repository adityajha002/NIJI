import React from 'react'
import style from './sec2b.module.css';
import videoSrc from '../../../assets/OIG2.mp4';



const VideoCard = () => {
  return (
    <div className={style.videoCards}>
      <video className={style.video} autoPlay loop muted>
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className={style.detailContainer}>
            <h1 className={style.detailHeading}> BUT WHY TO USE NIJI?</h1>
            <div className={style.detail}>
                  <p>
                        Local markets are full of great products, but finding exactly what you need can be frustrating. NIJI removes the guesswork by connecting you directly to nearby shops that have what you're looking for.
                  </p>
                  <div className={style.miniSearch}>
                        🔍︎ Poster printing near me
                  </div>
                  <div className={style.miniSearch}>
                        🔍︎ Cocoa powder Brand X
                  </div>
                  <div className={style.miniSearch}>
                        🔍︎ Paan Patta for Puja
                  </div>
            </div>
      </div>
    </div>
  )
}

export default VideoCard
