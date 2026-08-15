import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useParams } from "react-router-dom";
import style from "./Search.module.css";
import Navbar from "../../components/Navbar/Navbar";
import { getCurrentLocation } from "../../services/locationService";
import { searchProductsApi } from "../../services/productService";
import type { SearchProduct } from "../../types/product";

function SearchIcon() {
  return (
    <svg
      className={style.searchIcon}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16L21 21" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      className={style.filterIcon}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M4 6H20" />
      <path d="M7 12H17" />
      <path d="M10 18H14" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className={style.arrowIcon}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M5 12H19" />
      <path d="M13 6L19 12L13 18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className={style.closeIcon}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M6 6L18 18" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

export default function Search() {
  const { searchTerm } = useParams<{ searchTerm?: string }>();
  const routeSearchTerm = searchTerm ?? "";

  const [query, setQuery] = useState(routeSearchTerm);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState("relevance");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<
    string | null
  >(null);

  const performSearch = async (
    term: string,
    sortValue: string = sort,
    coords: { lat: number; lng: number } | null = location
  ) => {
    const cleanTerm = term.trim();

    setSubmittedQuery(cleanTerm);
    setCategory(null);

    if (!cleanTerm) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);

      const params = new URLSearchParams({ q: cleanTerm });

      if (sortValue === "distance" && coords) {
        params.set("lat", String(coords.lat));
        params.set("lng", String(coords.lng));
        params.set("sortBy", "distance");
      }

      const data: SearchProduct[] = await searchProductsApi(params.toString());
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setQuery(routeSearchTerm);
    performSearch(routeSearchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeSearchTerm]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      results
        .map((product) => product.category?.trim())
        .filter((value): value is string => Boolean(value))
    );

    return Array.from(uniqueCategories).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [results]);

  const filteredResults = useMemo(() => {
    const filtered = category
      ? results.filter(
          (product) =>
            product.category?.toLowerCase() ===
            category.toLowerCase()
        )
      : [...results];

    return filtered.sort((a, b) => {
      if (sort === "price-low") {
        return Number(a.price || 0) - Number(b.price || 0);
      }

      if (sort === "price-high") {
        return Number(b.price || 0) - Number(a.price || 0);
      }

      if (sort === "distance") {
        return (
          (a.distance ?? Infinity) -
          (b.distance ?? Infinity)
        );
      }

      return 0;
    });
  }, [results, category, sort]);

  const handleSortChange = async (value: string) => {
    setSort(value);

    if (value !== "distance") {
      performSearch(submittedQuery, value, location);
      return;
    }

    if (location) {
      performSearch(submittedQuery, "distance", location);
      return;
    }

    try {
      const coords = await getCurrentLocation();
      const nextLocation = {
        lat: coords.latitude,
        lng: coords.longitude,
      };

      setLocation(nextLocation);
      setLocationError(null);
      performSearch(submittedQuery, "distance", nextLocation);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Location access is needed to sort by distance.";

      console.error("Location error:", error);
      setLocationError(message);
      setSort("relevance");
      performSearch(submittedQuery, "relevance", null);
    }
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    performSearch(query, sort, location);
  };

  const clearSearch = () => {
    setQuery("");
    setSubmittedQuery("");
    setCategory(null);
    setResults([]);
  };

  const clearFilters = () => {
    setCategory(null);
  };

  return (
    <div className={style.page}>
      <main>
        <Navbar initialQuery={routeSearchTerm} />

        <section className={style.resultsArea}>
          <div className={style.resultsContainer}>
            <button
              className={style.mobileFilterButton}
              onClick={() => setMobileFilters(true)}
            >
              <FilterIcon />
              Filters
            </button>

            <aside
              className={`${style.filters} ${
                mobileFilters
                  ? style.filtersMobileOpen
                  : ""
              }`}
            >
              <div className={style.filterHeader}>
                <div>
                  <span>REFINE</span>
                  <h2>Filters</h2>
                </div>

                <button
                  className={style.mobileClose}
                  onClick={() => setMobileFilters(false)}
                >
                  <CloseIcon />
                </button>
              </div>

              {categories.length > 0 && (
                <div className={style.filterSection}>
                  <h3>Category</h3>

                  {categories.map((item) => (
                    <label
                      className={style.categoryOption}
                      key={item}
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={category === item}
                        onChange={() => setCategory(item)}
                      />

                      <span className={style.radio} />

                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              )}

              {category && (
                <button
                  className={style.clearFilters}
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              )}
            </aside>

            <div className={style.resultsContent}>
              <div className={style.resultsTop}>
                <div>
                  <h2>
                    {submittedQuery
                      ? `Results for "${submittedQuery}"`
                      : "Discover products near you"}
                  </h2>
                </div>

                <div className={style.sort}>
                  <label htmlFor="sort">
                    Sort by
                  </label>

                  <select
                    id="sort"
                    value={sort}
                    onChange={(event) =>
                      handleSortChange(event.target.value)
                    }
                  >
                    <option value="relevance">
                      Relevance
                    </option>
                    <option value="distance">
                      Nearest
                    </option>
                    <option value="price-low">
                      Price: Low to High
                    </option>
                    <option value="price-high">
                      Price: High to Low
                    </option>
                  </select>
                </div>
              </div>

              {locationError && (
                <p className={style.locationError}>
                  {locationError}
                </p>
              )}

              {category && (
                <div className={style.activeFilters}>
                  <span>Category:</span>

                  <button onClick={clearFilters}>
                    {category}
                    <CloseIcon />
                  </button>
                </div>
              )}

              {loading ? (
                <div className={style.noResults}>
                  <h3>Loading products</h3>
                </div>
              ) : filteredResults.length > 0 ? (
                <div className={style.resultList}>
                  {filteredResults.map((product) => (
                    <Link
                      key={product.product_id}
                      className={style.resultItem}
                      to={`/products/${product.product_id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div className={style.productImage}>
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                          />
                        ) : (
                          <span>Niji</span>
                        )}
                      </div>

                      <div className={style.productInfo}>
                        {product.category && (
                          <div
                            className={
                              style.productCategory
                            }
                          >
                            {product.category}
                          </div>
                        )}

                        <h3>{product.name}</h3>

                        {product.description && (
                          <p>{product.description}</p>
                        )}

                        <div className={style.productMeta}>
                          {product.shop_name && (
                            <>
                              <strong>
                                {product.shop_name}
                              </strong>

                              {product.distance != null && (
                                <span>•</span>
                              )}
                            </>
                          )}

                          {product.distance != null && (
                            <span>
                              {product.distance} km away
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={style.productPrice}>
                        <span>From</span>

                        <strong>
                          ₹{product.price}
                        </strong>
                      </div>

                      <a
                        href={`/products/${product.product_id}`}
                        className={style.resultAction}
                        aria-label={`View ${product.name}`}
                      >
                        <ArrowIcon />
                      </a>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className={style.noResults}>
                  <div className={style.noResultsIcon}>
                    <SearchIcon />
                  </div>

                  <h3>Nothing found</h3>

                  <p>
                    {submittedQuery
                      ? `No products matched "${submittedQuery}".`
                      : "Search for a product to see nearby results."}
                  </p>

                  {(query || submittedQuery) && (
                    <button onClick={clearSearch}>
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
