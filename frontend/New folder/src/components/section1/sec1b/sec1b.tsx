import { useState, useEffect, CSSProperties } from 'react';
import style from './sec1b.module.css';
import ShopCard from './shopcard';
import Loading from '../../loading/loading';
import { API_BASE_URL } from '../../../config/api';

interface Shop {
  shopid: number;
  shopname: string;
  category: string;
  pincode: string;
  description: string;
  imageurl: string;
  latitude: number;
  longitude: number;
  userid: number;
  tags: string[];
}

interface Sec1bProps {
  category: string;
}

const Sec1b = ({ category }: Sec1bProps) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/shops/loadCategory/${encodeURIComponent(category)}`
        );

        if (!res.ok) {
          throw new Error(`Failed to load shops (${res.status})`);
        }

        const data: Shop[] = await res.json();
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
    <div className={style.main} data-category={category}>
      {loading && <Loading message="Loading shops" variant="inline"/>}

      {!loading && error && (
        <p className={style.state}>{error}</p>
      )}

      {!loading && !error && visibleShops.length === 0 && (
        <p className={style.state}>No shops found.</p>
      )}

      {visibleShops.length > 0 && (
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
  );
};

export default Sec1b;