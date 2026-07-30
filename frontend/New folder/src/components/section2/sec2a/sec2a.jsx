import React from 'react'
import style from './sec2a.module.css';
import ShopCard from './shopcard.jsx';

const Sec2a = () => {
  const cards = Array.from({ length: 9 });

  return (
    <div className={style.main}>
      <div className={style.track}>
        {[...cards, ...cards].map((_, index) => (
          <ShopCard key={index} />
        ))}
      </div>
    </div>
  )
}

export default Sec2a
