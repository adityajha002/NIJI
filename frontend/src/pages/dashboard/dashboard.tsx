import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import style from "./dashboard.module.css";
import useAuth from "../../context/useAuth";
import ProductCard from "./productcard/productcard";
import AddProductForm from "./productcard/AddProductForm";
import { API_BASE_URL } from "../../config/api";

interface AddProductProps {
  onClick: () => void;
}

// --------------------------------------------------
// Add Product Card
// --------------------------------------------------

function AddProduct({
  onClick,
}: AddProductProps): React.JSX.Element {
  return (
    <div
      className={style.addProduct}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      <div className={style.addIcon}>+</div>

      <div className={style.addProductText}>
        Add a Product
      </div>
    </div>
  );
}

// --------------------------------------------------
// Main Dashboard
// --------------------------------------------------

export default function ShopDashboard(): React.JSX.Element {
  const { token, logout,user } = useAuth();
  const navigate = useNavigate();

  const [shop, setShop] = useState<ApiShop | null>(null);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const handleAuthError = useCallback((): void => {
    logout();
    navigate("/auth", { replace: true });
  }, [logout, navigate]);

  const fetchProducts = useCallback(
    async (
      shopId: string | number | undefined
    ): Promise<void> => {
      if (!shopId) {
        setProducts([]);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/products/shop/${shopId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          handleAuthError();
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Failed to fetch products: ${response.status}`
          );
        }

        const data: ApiProduct[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(
          "Error fetching products:",
          error
        );
      }
    },
    [token, handleAuthError]
  );

  const handleSuccess = async (): Promise<void> => {
    setShowAddProduct(false);
    await fetchProducts(shop?.shopid);
  };

  useEffect(() => {
    const fetchShop = async (): Promise<void> => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/shops/dashboard`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          handleAuthError();
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Failed to fetch shop: ${response.status}`
          );
        }

        const data: ApiShop = await response.json();

        setShop(data);
        await fetchProducts(data.shopid);
      } catch (error) {
        console.error(
          "Error fetching shop data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchShop();
    }
  }, [token, handleAuthError, fetchProducts]);

  if (loading) {
    return <div className={style.loadingScreen}>Loading...</div>;
  }

  return (
    <div className={style.page}>
      <div className={style.wrapper}>

        {/* ==================================================
            LEFT COLUMN
        ================================================== */}

        <div className={style.leftColumn}>

          {/* -----------------------------------------------
              SHOP OVERVIEW
          ----------------------------------------------- */}

          <section className={style.shopSection}>

            <div className={style.shopSectionHeader}>
              <div>
                <span className={style.eyebrow}>
                  Welcome Back
                </span>

                <h1 className={style.welcomeHeading}>
                  {user?.name?.toUpperCase() || "USER"}
                </h1>
              </div>
            </div>


            <div className={style.shopMain}>

              {/* Shop Image */}

              <div className={style.shopImageWrapper}>
                {shop?.imageurl ? (
                  <img
                    className={style.shopAvatar}
                    src={shop.imageurl}
                    alt={shop.shopname}
                  />
                ) : (
                  <div className={style.shopAvatarFallback}>
                    {shop?.shopname
                      ?.charAt(0)
                      .toUpperCase() || "S"}
                  </div>
                )}
              </div>


              {/* Shop Information */}

              <div className={style.shopInfo}>

                <h2 className={style.shopName}>
                  {shop?.shopname?.toUpperCase() ||
                    "SHOP NAME"}
                </h2>

                <div className={style.shopMeta}>
                  <span className={style.categoryBadge}>
                    {shop?.category?.toUpperCase() ||
                      "SHOP"}
                  </span>
                </div>

                <div className={style.locationRow}>
                  <span className={style.locationIcon}>
                    ●
                  </span>

                  <span>
                    {shop?.description ||
                      "Shop location not available"}
                  </span>
                </div>

              </div>
            </div>


            {/* -------------------------------------------
                SHOP ACTIONS
            ------------------------------------------- */}

            <div className={style.shopActions}>

              <Link
                to="/"
                className={style.actionButton}
              >
                <span className={style.actionIcon}>
                  <img
                    src="/assets/home.png"
                    alt=""
                  />
                </span>
              </Link>


              <Link
                to="/shop-edit"
                className={style.actionButton}
              >
                <span className={style.actionIcon}>
                  <img
                    src="/assets/edit.webp"
                    alt=""
                  />
                </span>
              </Link>


              <Link
                to="/shop-edit"
                className={style.actionButton}
              >
                <span className={style.actionIcon}>
                  <img
                    src="/assets/setting.png"
                    alt=""
                  />
                </span>
              </Link>

            </div>

          </section>


          {/* -----------------------------------------------
              INBOX
          ----------------------------------------------- */}

          <section className={style.inboxSection}>

            <div className={style.inboxHeader}>

              <div>
                <span className={style.eyebrow}>
                  COMMUNICATION
                </span>

                <h2>Inbox</h2>
              </div>

              <div className={style.inboxCount}>
                0
              </div>

            </div>


            <div className={style.inboxEmpty}>

              <div className={style.inboxIcon}>
                ✉
              </div>

              <h3>No new messages</h3>

              <p>
                Customer messages and shop
                notifications will appear here.
              </p>

            </div>

          </section>

        </div>


        {/* ==================================================
            RIGHT COLUMN — KEEPING YOUR EXISTING UI
        ================================================== */}

        <div className={style.rightColumn}>

          <div className={style.rightHeader}>
            <h1 className={style.productsHeading}>
              ACTIVE PRODUCTS
            </h1>
          </div>


          {!showAddProduct && (
            <div className={style.productsGrid}>

              {products.map((product) => (
                <ProductCard
                  key={product.product_id}
                  image={product.imageurl}
                  name={product.name}
                  price={Number(product.price)}
                  stockCount={0}
                  inStock={product.active !== false}
                />
              ))}


              <AddProduct
                onClick={() =>
                  setShowAddProduct(true)
                }
              />

            </div>
          )}


          {showAddProduct && (
            <AddProductForm
              onCancel={() =>
                setShowAddProduct(false)
              }
              onSuccess={handleSuccess}
            />
          )}

        </div>

      </div>
    </div>
  );
}
