import React, { useState, useEffect, useCallback, CSSProperties } from "react";
import { useNavigate, Link } from "react-router-dom";
import style from "./dashboard.module.css";
import useAuth from "../../context/useAuth";
import ProductCard from "./productcard/productcard";
import AddProductForm from "./productcard/AddProductForm";
import MiniHeader from "../../components/MiniHead/MiniHead";
import Loading from "../../components/loading/loading";
import { API_BASE_URL } from "../../config/api";

interface MiniHeaderProps {
  style?: CSSProperties;
}

interface AddProductProps {
  onClick: () => void;
}

interface Product {
  product_id: string | number;
  imageurl: string;
  name: string;
  price: number | string;
  active?: boolean;
  [key: string]: unknown;
}

interface Shop {
  shopid: string | number;
  shopname: string;
  imageurl?: string;
  category?: string;
  description?: string;
  [key: string]: unknown;
}

// --- Helper Component ---

function AddProduct({ onClick }: AddProductProps): React.JSX.Element {
  return (
    <div className={style.addProduct} onClick={onClick}>
      <h1 style={{ fontSize: '48px', margin: 0, lineHeight: 1 }}>+</h1>
      <h2 style={{ fontSize: '15px', fontWeight: '600', marginTop: '8px' }}>
        Add a Product
      </h2>
    </div>
  );
}

// --- Main Component ---

export default function ShopDashboard(): React.JSX.Element {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddProduct, setShowAddProduct] = useState<boolean>(false);

  const handleAuthError = useCallback((): void => {
    logout();
    navigate("/auth", { replace: true });
  }, [logout, navigate]);

  const fetchProducts = useCallback(
    async (shopId: string | number | undefined): Promise<void> => {
      if (!shopId) {
        setProducts([]);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/products/shop/${shopId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401 || response.status === 403) {
          handleAuthError();
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
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
        const response = await fetch(`${API_BASE_URL}/api/shops/dashboard`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401 || response.status === 403) {
          handleAuthError();
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch shop: ${response.status}`);
        }

        const data: Shop = await response.json();
        setShop(data);
        await fetchProducts(data.shopid);
      } catch (error) {
        console.error('Error fetching shop data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchShop();
    }
  }, [token, handleAuthError, fetchProducts]);

  if (loading) {
    return <Loading message="Loading dashboard" />;
  }

  return (
    <div className={style.page}>
      <div className={style.wrapper}>
        {/* LEFT COLUMN — 70% top / 30% bottom */}
        <div className={style.leftColumn}>
          {/* Top 70% */}
          <div className={style.leftTop}>
            <div><MiniHeader /></div>
            <div className={style.leftTopInfo}>
              <div>
                <div className={style.shopHeader}>
                  <div>
                    <p className={style.shopLabel}>YOUR SHOP</p>
                    <h2 className={style.shopName}>
                      {shop?.shopname?.toUpperCase() || "SHOP NAME"}
                    </h2>
                  </div>
                  {/* Shop avatar / logo placeholder */}
                  <img
                    className={style.shopAvatar}
                    src={shop?.imageurl || ""}
                    alt="Shop Avatar"
                  />
                </div>

                {/* Tab bar */}
                <div className={style.navBar}>
                  <div className={style.nav}>
                    <div className={style.mapIcon}></div>
                    MAPS
                  </div>
                  <div className={style.cat}>
                    {shop?.category?.toUpperCase() || "Shop"}
                  </div>
                </div>
              </div>

              <div className={style.descriptionRow}>
                <div className={style.descriptionBox}>
                  <p className={style.descriptionLabel}>
                    {shop?.description?.toUpperCase() || "Shop Address"}
                  </p>
                </div>

                {/* Pagination dots */}
                <div className={style.dotsColumn}>
                  <Link to="/">
                    <div className={style.dot1} />
                  </Link>
                  <Link to="/shop-edit">
                    <div className={style.dot2} />
                  </Link>
                  <div className={style.dot3} />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 30% */}
          <div className={style.leftBottom}>
            <div className={style.inboxHeader}>
              <h2 style={{ marginLeft: '60px' }}>INBOX</h2>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — full height */}
        <div className={style.rightColumn}>
          <div className={style.rightHeader}>
            <h1 className={style.productsHeading}>ACTIVE PRODUCTS</h1>
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
              <AddProduct onClick={() => setShowAddProduct(true)} />
            </div>
          )}
          {showAddProduct && (
            <AddProductForm
              onCancel={() => setShowAddProduct(false)}
              onSuccess={handleSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}