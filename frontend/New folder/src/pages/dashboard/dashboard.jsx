import React from "react";
import style from "./dashboard.module.css";
import useAuth from "../../context/useAuth";
import {useState, useEffect, useCallback} from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./productcard/productcard.jsx";
import AddProductForm from "./productcard/AddProductForm.jsx";
// import ChatInbox from "./ChatInbox";

function AddProduct({ onClick }) {
  return (
    <div className={style.addProduct} onClick={onClick}>
      <h1 style={{ fontSize: '60px' }}>+</h1>
      <h2>Add a Product</h2>
    </div>
  );
}

export default function ShopDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const handleAuthError = useCallback(() => {
    logout();
    navigate("/auth", { replace: true });
  }, [logout, navigate]);

  const fetchProducts = useCallback(async (shopId) => {
    if (!shopId) {
      setProducts([]);
      return;
    }

    const response = await fetch(`/api/products/shop/${shopId}`, {
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

    const data = await response.json();
    setProducts(data);
  }, [token, handleAuthError]);

  const handleSuccess = async () => {
    setShowAddProduct(false);
    await fetchProducts(shop?.shopid);
  };

  useEffect(() => {
    const fetchShop = async () => {
      try{
        const response = await fetch('/api/shops/dashboard', {
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

        const data = await response.json();
        setShop(data);
        await fetchProducts(data.shopid);
      } catch (error) {
        console.error('Error fetching shop data:', error);
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchShop();
  },[token, handleAuthError, fetchProducts]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={style.page}>
      <div className={style.wrapper}>
        {/* LEFT COLUMN — 70% top / 30% bottom */}
        <div className={style.leftColumn}>
          {/* top 70% */}
          <div className={style.leftTop}>
            <h1 className={style.welcomeHeading}>WELCOME {user?.name?.toUpperCase() || "USER"}</h1>
            <div>
              <div className={style.shopHeader}>
                <div>
                  <p className={style.shopLabel}>YOUR SHOP</p>
                  <h2 className={style.shopName}>{shop?.shopname?.toUpperCase() || "SHOP NAME"}</h2>
                </div>
                {/* shop avatar / logo placeholder */}
                <img className={style.shopAvatar} src={shop?.imageurl} alt="Shop Avatar" />
              </div>

              {/* tab bar */}
              <div className={style.navBar}>
                <div className={style.nav}> <div className={style.mapIcon}></div>MAPS</div>
                <div className={style.cat}>{shop?.category?.toUpperCase() || "Shop"}</div>
              </div>
            </div>

            <div className={style.descriptionRow}>
              <div className={style.descriptionBox}>
                <p className={style.descriptionLabel}>{shop?.description?.toUpperCase() || "Shop Adress"}</p>
              </div>

              {/* pagination dots */}
              <div className={style.dotsColumn}>
                <div className={style.dot} />
                <div className={style.dot} />
                <div className={style.dot} />
              </div>
            </div>
          </div>

          {/* bottom 30% */}
          <div className={style.leftBottom}>
            <div className={style.inboxHeader}> <h2 style={{ marginLeft: '60px' }}>INBOX </h2></div>
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
