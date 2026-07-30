import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import style from './shopView.module.css'
import Loading from '../../../components/loading/loading.jsx'
import { API_BASE_URL } from '../../../config/api.js'

const ShopView = () => {
      const { id } = useParams();
      const [shop, setShop] = useState(null);
      const [products, setProducts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');
      const [failedImages, setFailedImages] = useState({});

      useEffect(() => {
            const fetchShop = async () => {
                  if (!id) return;

                  setLoading(true);
                  setError('');

                  try {
                        const [shopRes, productsRes] = await Promise.all([
                              fetch(`${API_BASE_URL}/api/shops/${id}`),
                              fetch(`${API_BASE_URL}/api/products/shop/${id}`),
                        ]);

                        if (!shopRes.ok) {
                              throw new Error("Failed to fetch the shop");
                        }

                        if (!productsRes.ok) {
                              throw new Error("Failed to fetch shop products");
                        }

                        const shopData = await shopRes.json();
                        const productsData = await productsRes.json();

                        setShop(shopData);
                        setProducts(productsData);
                        setFailedImages({});
                  } catch (err) {
                        console.error(err);
                        setError(err.message || 'Something went wrong');
                  } finally {
                        setLoading(false);
                  }
            }
            fetchShop();
      }, [id])

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
            : (typeof shop.tags === 'string' && shop.tags.length
                  ? shop.tags.split(',').map(t => t.trim()).filter(Boolean)
                  : []);

      const locationQuery = shop.description || shop.pincode;
      const mapsHref = shop.latitude && shop.longitude
            ? `https://www.google.com/maps/search/?api=1&query=${shop.latitude},${shop.longitude}`
            : locationQuery
                  ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}`
                  : null;

      return (
            <div className={style.page}>
                  <div className={style.card}>
                        <div className={style.rail} aria-hidden="true">
                              <span>{(shop.shopname || '?').charAt(0).toUpperCase()}</span>
                        </div>

                        <div className={style.body}>
                              <div className={style.headRow}>
                                    <div className={style.identity}>
                                          <h1 className={style.shopName}>{shop.shopname}</h1>
                                          <div className={style.metaRow}>
                                                {shop.category && (
                                                      <span className={style.category}>{shop.category}</span>
                                                )}
                                                {tags.length > 0 && (
                                                      <span className={style.tagList}>
                                                            {tags.map((tag, i) => (
                                                                  <span key={i} className={style.tag}>#{tag}</span>
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
                                                            Directions
                                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                                  <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                      </a>
                                                )}
                                          </div>
                                    </div>

                                    <div className={style.headActions}>
                                          <button type="button" className={style.messageBtn}>
                                                Message
                                          </button>
                                          <div className={style.thumb}>
                                                {shop.imageurl && !failedImages.shop ? (
                                                      <img
                                                            src={shop.imageurl}
                                                            alt={shop.shopname}
                                                            onError={() => setFailedImages((current) => ({ ...current, shop: true }))}
                                                      />
                                                ) : (
                                                      <span className={style.thumbFallback}>{(shop.shopname || '?').charAt(0).toUpperCase()}</span>
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
                                          <article key={product.product_id} className={style.productCard}>
                                                <div className={style.productImage}>
                                                      {product.imageurl && !failedImages[product.product_id] ? (
                                                            <img
                                                                  src={product.imageurl}
                                                                  alt={product.name}
                                                                  loading="lazy"
                                                                  onError={() => setFailedImages((current) => ({
                                                                        ...current,
                                                                        [product.product_id]: true,
                                                                  }))}
                                                            />
                                                      ) : (
                                                            <span className={style.productImageFallback}>No image</span>
                                                      )}
                                                </div>
                                                <div className={style.productInfo}>
                                                      <h3>{product.name}</h3>
                                                      {product.description && (
                                                            <p className={style.productDesc}>{product.description}</p>
                                                      )}
                                                      <span className={style.price}>₹{product.price}</span>
                                                </div>
                                          </article>
                                    ))}
                              </div>
                        )}
                  </section>
            </div>
      )
}

export default ShopView
