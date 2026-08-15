import { useState } from 'react';
import { Link } from 'react-router-dom';
import style from './ShopCard.module.css';
import type { ApiShop } from '../../types/shop';

interface ShopCardProps {
  shop: ApiShop | {
    shopid: number;
    shopname: string;
    imageurl?: string;
  };
}

const ShopCard = ({ shop }: ShopCardProps) => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <Link to={`/shops/${shop.shopid}`} className={style.main}>
      <div className={style.image}>
        {shop.imageurl && !imageFailed ? (
          <img
            src={shop.imageurl}
            alt={shop.shopname}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className={style.imageFallback}>{shop.shopname?.charAt(0)?.toUpperCase() || 'N'}</span>
        )}
      </div>
      <div className={style.info}>
        <h3>{shop.shopname}</h3>
      </div>
    </Link>
  );
};

export default ShopCard;
