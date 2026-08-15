import React from 'react';
import style from './ProductCard.module.css';
import type { ProductPreview } from '../../types/product';

export interface ProductCardProps {
  product: ProductPreview;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { name, price, image_url } = product;

  return (
    <div className={style.card}>
      <div className={style.imageWrapper}>
        {image_url ? (
          <img src={image_url} alt={name} className={style.image} />
        ) : (
          <div className={style.placeholder} />
        )}
      </div>
      <div className={style.footer}>
        <span className={style.name}>{name}</span>
        <span className={style.price}>${price.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default ProductCard;
