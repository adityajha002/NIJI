import { useEffect, useState } from "react";
import style from "./ProductView.module.css";
import Navbar from "../../components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import { fetchProductById } from "../../services/productService";
import type { ProductPageData } from "../../types/product";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12H19" />
      <path d="M13 6L19 12L13 18" />
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

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 10.5C20 16 12 21 12 21C12 21 4 16 4 10.5C4 6.91 7.58 4 12 4C16.42 4 20 6.91 20 10.5Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export default function ProductView() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<ProductPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!productId) {
      setError(true);
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(false);

        const data: ProductPageData = await fetchProductById(productId);
        setProduct(data);
      } catch (requestError) {
        console.error("Product request failed:", requestError);
        setProduct(null);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className={style.page}>
        <Navbar />
        <main className={style.main}>
          <div className={style.container}>
            <div className={style.stateMessage}>Loading product...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={style.page}>
        <Navbar />
        <main className={style.main}>
          <div className={style.container}>
            <div className={style.stateMessage}>
              <h1>Product unavailable</h1>
              <a href="/search" className={style.backLink}>
                <BackIcon />
                <span>Back to search</span>
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const shop = product.shop ?? {
    shop_id: product.shop_id,
    shop_name: product.shop_name,
    category: product.shop_category,
    description: product.shop_description,
    image_url: product.shop_image_url,
  };

  const shopRoute = `/shops/${shop.shop_id}`;

  return (
    <div className={style.page}>
      <Navbar />

      <main className={style.main}>
        <div className={style.container}>

          {/* BACK */}
          <a href="/search" className={style.backLink}>
            <BackIcon />
            <span>Back to search</span>
          </a>

          {/* PRODUCT */}
          <section className={style.productSection}>

            {/* IMAGE */}
            <div className={style.productVisual}>
              <div className={style.imageFrame}>
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} />
                ) : (
                  <span className={style.imageFallback}>Niji</span>
                )}

                <div className={style.imageShade} />

                <div className={style.imageTop}>

                </div>
              </div>
            </div>

            {/* DETAILS */}
            <div className={style.productDetails}>

              <h1>{product.name.toUpperCase()}</h1>

              <div className={style.priceArea}>

                <div className={style.price}>
                  <span className={style.currency}>₹</span>
                  {product.price}
                </div>

              </div>

              <div className={style.detailsDivider} />

              <div className={style.descriptionBlock}>

                <p>{product.description}</p>
              </div>

              <div className={style.productInfo}>
                <div>
                  <span>Category</span>
                  <strong>{product.category?.toUpperCase()}</strong>
                </div>

                <div>
                  <span>Seller</span>
                  <strong>{shop.shop_name?.toUpperCase()}</strong>
                </div>
              </div>

              <a href={shopRoute} className={style.shopButton}>
                <span>
                  GET DIRECTIONS
                </span>
              </a>
            </div>
          </section>

          {/* SHOP */}
          <section className={style.shopSection}>

            <div className={style.sectionTop}>
              <div>
                <h2>SOLD BY</h2>
              </div>
            </div>

            <a href={shopRoute} className={style.shopCard}>

              <div className={style.shopImage}>
                {shop.image_url ? (
                  <img src={shop.image_url} alt={shop.shop_name} />
                ) : (
                  <span>Shop</span>
                )}

                <div className={style.shopImageOverlay} />
              </div>

              <div className={style.shopInfo}>

                <div className={style.shopInfoTop}>
                  <span className={style.shopCategory}>
                    {shop.category}
                  </span>

                </div>

                <h3>{shop.shop_name}</h3>

                <p>{shop.description}</p>

                <div className={style.shopLocation}>
                  <PinIcon />
                  <span>Your neighbourhood</span>
                </div>
              </div>

              <div className={style.shopCardArrow}>
                <ArrowIcon />
              </div>

            </a>
          </section>

          {/* FOOTER LINE */}
          <div className={style.bottomStatement}>
            <span>NIJIHAAT</span>
            <span>DISCOVER · SHOP · LOCAL</span>
          </div>

        </div>
      </main>
    </div>
  );
}
