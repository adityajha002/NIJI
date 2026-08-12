import React from "react";
import style from "./product.module.css";
import Header from "../../components/nav/nav";

const product: ProductPreview = {
  product_id: 1,
  name: "Full Cream Milk",
  description:
    "Fresh, rich and creamy full cream milk sourced from a trusted local dairy shop. Perfect for everyday use, tea, coffee and homemade recipes.",
  price: 68,
  category: "Dairy",
  image_url:
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1000&q=85",
};

const shop: ShopPreview = {
  shop_id: 101,
  shop_name: "Sharma Dairy",
  category: "Dairy & Milk Products",
  description:
    "A local dairy shop serving fresh milk and everyday dairy products to the neighbourhood.",
  image_url:
    "https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&w=900&q=85",
};

/*
 * Replace these with your actual routes.
 */
const SHOP_ROUTE = `/shops/${shop.shop_id}`;
const MESSAGE_ROUTE = `/shops/${shop.shop_id}/message`;

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12H19" />
      <path d="M13 6L19 12L13 18" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 11.5C20 15.64 16.42 19 12 19C10.77 19 9.61 18.74 8.59 18.28L4 20L5.38 16.2C4.5 14.9 4 13.3 4 11.5C4 7.36 7.58 4 12 4C16.42 4 20 7.36 20 11.5Z" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19 12H5" />
      <path d="M11 6L5 12L11 18" />
    </svg>
  );
}

export default function ProductView() {
  return (
    <div className={style.page}>
      <Header />

      <main className={style.main}>
        <div className={style.container}>
          <a href="/search" className={style.backLink}>
            <BackIcon />
            <span>Back to search</span>
          </a>

          <section className={style.productSection}>
            <div className={style.productVisual}>
              <div className={style.imageFrame}>
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} />
                ) : (
                  <span className={style.imageFallback}>Niji</span>
                )}
              </div>

              <div className={style.categoryTag}>{product.category}</div>
            </div>

            <div className={style.productDetails}>
              <span className={style.eyebrow}>PRODUCT DETAILS</span>

              <h1>{product.name}</h1>

              <div className={style.priceRow}>
                <span className={style.priceLabel}>LOCAL PRICE</span>
                <strong>₹{product.price}</strong>
              </div>

              <div className={style.divider} />

              <div className={style.descriptionBlock}>
                <h2>Description</h2>
                <p>{product.description}</p>
              </div>

              <a href={SHOP_ROUTE} className={style.shopButton}>
                <span>Visit {shop.shop_name}</span>
                <ArrowIcon />
              </a>

              <p className={style.shopHint}>
                View availability, other products and details from this local
                shop.
              </p>
            </div>
          </section>

          <section className={style.shopSection}>
            <div className={style.sectionHeading}>
              <div>
                <span className={style.eyebrow}>SOLD BY</span>
                <h2>Local shop</h2>
              </div>

              <span className={style.nearbyLabel}>LOCAL BUSINESS</span>
            </div>

            <a href={SHOP_ROUTE} className={style.shopCard}>
              <div className={style.shopImage}>
                {shop.image_url ? (
                  <img src={shop.image_url} alt={shop.shop_name} />
                ) : (
                  <span>Shop</span>
                )}
              </div>

              <div className={style.shopInfo}>
                <span className={style.shopCategory}>{shop.category}</span>
                <h3>{shop.shop_name}</h3>
                <p>{shop.description}</p>
              </div>

              <div className={style.shopArrow}>
                <ArrowIcon />
              </div>
            </a>

            <div className={style.shopActions}>
              <a href={SHOP_ROUTE} className={style.primaryAction}>
                View shop
                <ArrowIcon />
              </a>

              <a href={MESSAGE_ROUTE} className={style.secondaryAction}>
                <MessageIcon />
                Message shop
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
