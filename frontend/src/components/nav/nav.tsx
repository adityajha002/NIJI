import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";  
import './nav.module.css'
import style from './nav.module.css'
import {useAuth} from '../../context/useAuth'
import { useDebounce } from '../../hooks/useDebounce'

interface NavProps {
  setSideMenu?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SearchResult {
  product_id: number;
  name: string;
  image_url: string;
}

const Nav: React.FC<NavProps> = ({ setSideMenu }) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, token } = useAuth();

  const debouncedQuery = useDebounce(query, 300);

  const openSideMenu = () => {
    setSideMenu?.((isOpen) => !isOpen);
  }

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const runSearch = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SEARCH_API_URL}/search?q=${encodeURIComponent(debouncedQuery)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`Search failed: ${res.status}`);
        const data: SearchResult[] = await res.json();
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

  const showDropdown = isFocused && debouncedQuery.trim().length > 0;

  return (
    <div className={style.nav}>
      <div className={style.film}>
        <Link to='/' className={style.logoLink}>
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
              onBlur={() => setTimeout(() => setIsFocused(false), 300)}
            />
            <Link
              to="/search"
              className={`${style.searchIcon} ${isFocused ? style.active : ""}`}
              onMouseDown={(event) => event.preventDefault()}
              aria-label="Open search page"
            />
          </div>

          {showDropdown && (
            <div className={style.searchResults}>
              <div className={style.searchSection}>
                {isLoading ? (
                  <div className={style.searchItem}>Searching...</div>
                ) : results.length > 0 ? (
                  results.map((r) => (
                    <Link
                      key={r.product_id}
                      to={`/shops/${r.product_id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div className={style.searchItem}>{r.name}</div>
                    </Link>
                  ))
                ) : (
                  <div className={style.searchItem}>No results found</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={style.navActions}>
            <Link to="/" style={{textDecoration:"none"}}><div className={style.navOpts1}>INBOX</div></Link>
            { user ? (
              <Link to="/redirect-to-profile" style={{textDecoration:"none"}}><div className={style.navOpts2}>PROFILE</div></Link>
            ) : (
              <Link to="/auth" style={{textDecoration:"none"}}><div className={style.login}>LOGIN</div></Link>
            )}
            { user ? (
              <div className={style.menuBtn} onClick={openSideMenu}>MENU</div>
            ) : null}
          
        </div>
      </div>
    </div>
  )
}

export default Nav
