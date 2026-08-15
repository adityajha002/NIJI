import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import style from './Navbar.module.css';
import { useAuth } from '../../context/useAuth';
import { useDebounce } from '../../hooks/useDebounce';
import { searchProductsApi } from '../../services/productService';

export interface NavbarProps {
  setSideMenu?: React.Dispatch<React.SetStateAction<boolean>>;
  initialQuery?: string;
}

interface SearchResult {
  product_id: number;
  name: string;
  image_url: string;
}

const Navbar = ({
  setSideMenu,
  initialQuery = ""
}: NavbarProps): React.JSX.Element => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [query, setQuery] = useState<string>(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user } = useAuth();

  const debouncedQuery = useDebounce(query, 300);

  const searchPath = query.trim()
    ? `/search/${encodeURIComponent(query.trim())}`
    : '/search';

  const openSideMenu = () => {
    setSideMenu?.((isOpen) => !isOpen);
  };

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const runSearch = async () => {
      setIsLoading(true);

      try {
        const data: SearchResult[] = await searchProductsApi(
          `q=${encodeURIComponent(debouncedQuery)}`,
          controller.signal
        );
        setResults(data);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Search error:', err);
          setResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    runSearch();

    return () => controller.abort();
  }, [debouncedQuery]);

  const showDropdown =
    isFocused &&
    debouncedQuery.trim().length > 0;

  return (
    <div className={style.nav}>
      <div className={style.film}>
        <Link to="/" className={style.logoLink}>
          <div className={style.logo}></div>
        </Link>

        <div className={style.searchWrapper}>
          <div className={style.searchBar}>
            <input
              type="text"
              className={style.search}
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() =>
                setTimeout(() => setIsFocused(false), 300)
              }
            />

            <Link
              to={searchPath}
              className={`${style.searchIcon} ${isFocused ? style.active : ""}`}
              onMouseDown={(event) => event.preventDefault()}
              aria-label="Open search page"
            />
          </div>

          {showDropdown && (
            <div className={style.searchResults}>
              <div className={style.searchSection}>
                {isLoading ? (
                  <div className={style.searchItem}>
                    Searching...
                  </div>
                ) : results.length > 0 ? (
                  results.map((r) => (
                    <Link
                      key={r.product_id}
                      to={`/search/${encodeURIComponent(r.name)}`}
                      style={{
                        textDecoration: 'none',
                        color: 'inherit'
                      }}
                    >
                      <div className={style.searchItem}>
                        {r.name}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className={style.searchItem}>
                    No results found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={style.navActions}>
          <Link
            to="/"
            style={{ textDecoration: "none" }}
          >
            <div className={style.navOpts1}>
              INBOX
            </div>
          </Link>

          {user ? (
            <Link
              to="/redirect-to-profile"
              style={{ textDecoration: "none" }}
            >
              <div className={style.navOpts2}>
                PROFILE
              </div>
            </Link>
          ) : (
            <Link
              to="/auth"
              style={{ textDecoration: "none" }}
            >
              <div className={style.login}>
                LOGIN
              </div>
            </Link>
          )}

          {user ? (
            <div
              className={style.menuBtn}
              onClick={openSideMenu}
            >
              MENU
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
