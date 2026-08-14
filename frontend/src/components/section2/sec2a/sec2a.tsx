import React from 'react';
import style from './sec2a.module.css';

const ProductCard: React.FC<{ product: ProductPreview }> = ({ product }) => {
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

const defaultProducts: ProductPreview[] = Array.from({ length: 5 }, (_, i) => ({
  product_id: i + 1,
  name: 'Name',
  description: 'Sample description',
  price: 7.99,
  category: 'General',
}));

interface ParentProps {
  products?: ProductPreview[];
}

export const Sec2a: React.FC<ParentProps> = ({ products = defaultProducts }) => {
  return (
    <div className={style.container}>
      <h1>Products you may like...</h1>
      <div className={style.grid}>
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Sec2a;