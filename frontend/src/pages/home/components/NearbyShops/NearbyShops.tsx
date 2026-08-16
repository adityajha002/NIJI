import { useState, useEffect, CSSProperties } from 'react';
import style from './NearbyShops.module.css';
import CategoryNav from '../../../../components/Category/CategoryNav';
import ShopCard from '../../../../components/ShopCard/ShopCard';
import Loading from '../../../../components/loading/loading';
import { fetchShopsByCategory } from '../../../../services/shopService';
import type { ApiShop } from '../../../../types/shop';

const NearbyShops = () => {
  const [category, setCategory] = useState("All");
  const [shops, setShops] = useState<ApiShop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      setError('');

      try {
        const data: ApiShop[] = await fetchShopsByCategory(category);
        setShops(data);
      } catch (err) {
        console.error('Error loading shops for category:', err);
        setShops([]);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error loading shops');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [category]);

  const visibleShops = shops.length > 0 ? [...shops, ...shops] : [];
  const scrollDuration = `${Math.max(shops.length * 3, 12)}s`;

  return (
    <div className={style.section1}>
      <CategoryNav category={category} setCategory={setCategory} />
      
      <div className={style.main} data-category={category}>
        {loading && <Loading message="Loading shops" variant="inline"/>}

        {!loading && error && (
          <p className={style.state}>{error}</p>
        )}

        {!loading && !error && visibleShops.length === 0 && (
          <p className={style.state}>No shops found.</p>
        )}

        {!loading && visibleShops.length > 0 && (
          <div
            key={category}
            className={style.track}
            style={
              {
                '--scroll-duration': scrollDuration,
              } as CSSProperties
            }
          >
            {visibleShops.map((shop, index) => (
              <ShopCard
                key={`${shop.shopid}-${index}`}
                shop={shop}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyShops;
