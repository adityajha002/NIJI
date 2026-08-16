import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import style from "./Shop.module.css";
import Loading from "../../components/loading/loading";
import { fetchShopById } from "../../services/shopService";
import { fetchProductsByShop } from "../../services/productService";
import { useAuth } from "../../context/useAuth";
import type { ApiShop } from "../../types/shop";
import type { ApiProduct } from "../../types/product";

type FailedImages = {
  shop?: boolean;
  [key: number]: boolean;
};

const ShopView = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();

  const [shop, setShop] = useState<ApiShop | null>(null);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [failedImages, setFailedImages] = useState<FailedImages>({});

  useEffect(() => {
    const fetchShop = async () => {
      if (!id) return;

      setLoading(true);
      setError("");

      try {
        const [shopData, productsData] = await Promise.all([
          fetchShopById(id),
          fetchProductsByShop(id, token),
        ]);

        setShop(shopData);
        setProducts(productsData);
        setFailedImages({});
      } catch (err) {
        console.error(err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [id, token]);

  if (loading) {
    return <Loading message="Loading shop" />;
  }

  if (error) {
    return (
      <div className={style.stateScreen}>
        <p className={style.stateTextError}>{error}</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className={style.stateScreen}>
        <p className={style.stateText}>Shop not found</p>
      </div>
    );
  }

  const tags = Array.isArray(shop.tags)
    ? shop.tags
    : typeof shop.tags === "string" && shop.tags.length
      ? shop.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

  const locationQuery = shop.description || shop.pincode;

  const mapsHref =
    shop.latitude && shop.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${shop.latitude},${shop.longitude}`
      : locationQuery
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          locationQuery
        )}`
        : null;

  return (
    <div className={style.page}>
      <div className={style.card}>
        <div className={style.rail} aria-hidden="true">
          <span>{(shop.shopname || "?").charAt(0).toUpperCase()}</span>
        </div>

        <div className={style.body}>
          <div className={style.headRow}>
            <div className={style.identity}>
              <h1 className={style.shopName}>{shop.shopname.toUpperCase()}</h1>

              <div className={style.metaRow}>
                {shop.category && (
                  <span className={style.category}>{shop.category.toUpperCase()}</span>
                )}

                {tags.length > 0 && (
                  <span className={style.tagList}>
                    {tags.map((tag, i) => (
                      <span key={i} className={style.tag}>
                        #{tag}
                      </span>
                    ))}
                  </span>
                )}

                {mapsHref && (
                  <a
                    className={style.mapsBtn}
                    href={mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    MAPS
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M20 10.5C20 16 12 22 12 22S4 16 4 10.5a8 8 0 1 1 16 0Z"
                        fill="black"
                      />
                      <circle
                        cx="12"
                        cy="10.5"
                        r="3"
                        fill="white"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {shop.description && (
            <div className={style.description}>
              <span className={style.descLabel}>Description</span>
              <p>{shop.description}</p>
            </div>
          )}
        </div>
        <div className={style.headActions}>

          <div className={style.thumb}>
            {shop.imageurl && !failedImages.shop ? (
              <img
                src={shop.imageurl}
                alt={shop.shopname}
                onError={() =>
                  setFailedImages((current) => ({
                    ...current,
                    shop: true,
                  }))
                }
              />
            ) : (
              <span className={style.thumbFallback}>
                {(shop.shopname || "?").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <button type="button" className={style.messageBtn}>
            MESSAGE
          </button>
        </div>
      </div>

      <section className={style.productsSection}>
        <div className={style.sectionHead}>
          <h2>Products</h2>
          <span className={style.count}>{products.length}</span>
        </div>

        {products.length === 0 ? (
          <div className={style.emptyState}>
            <p>No products listed yet.</p>
          </div>
        ) : (
          <div className={style.productGrid}>
            {products.map((product) => (
              <article
                key={product.product_id}
                className={style.productCard}
              >
                <div className={style.productImage}>
                  {product.imageurl &&
                    !failedImages[Number(product.product_id)] ? (
                    <img
                      src={product.imageurl}
                      alt={product.name}
                      loading="lazy"
                      onError={() =>
                        setFailedImages((current) => ({
                          ...current,
                          [Number(product.product_id)]: true,
                        }))
                      }
                    />
                  ) : (
                    <span className={style.productImageFallback}>
                      No image
                    </span>
                  )}
                </div>

                <div className={style.productInfo}>
                  <h3>{product.name}</h3>

                  {product.description && (
                    <p className={style.productDesc}>
                      {product.description}
                    </p>
                  )}

                  <span className={style.price}>
                    ₹{product.price}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ShopView;
