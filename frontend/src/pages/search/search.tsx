import React, {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import style from "./search.module.css";
import Header from "../../components/nav/nav";
import { API_BASE_URL } from "../../config/api";

const demoProducts: SearchProduct[] = [
  {
    product_id: 1,
    name: "Full Cream Milk",
    description: "Fresh full cream milk",
    price: 68,
    category: "Dairy",
    image_url:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80",
    shop_name: "Sharma Dairy",
    distance: 0.7,
  },
  {
    product_id: 2,
    name: "Fresh Cow Milk",
    description: "Fresh local cow milk",
    price: 72,
    category: "Dairy",
    image_url:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=80",
    shop_name: "Green Farm Dairy",
    distance: 1.2,
  },
  {
    product_id: 3,
    name: "Amul Taaza Milk",
    description: "Fresh packaged milk",
    price: 64,
    category: "Dairy",
    image_url:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=500&q=80",
    shop_name: "Gupta General Store",
    distance: 1.8,
  },
  {
    product_id: 4,
    name: "Buffalo Milk",
    description: "Rich and creamy buffalo milk",
    price: 78,
    category: "Dairy",
    image_url:
      "https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&w=500&q=80",
    shop_name: "Verma Dairy",
    distance: 2.4,
  },
];

const categories = [
  "All",
  "Dairy",
  "Groceries",
  "Fruits & Vegetables",
  "Bakery",
  "Snacks",
];

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

function LocationIcon() {
  return (
    <svg
      className={style.locationIcon}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M20 10C20 15.5 12 21 12 21S4 15.5 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
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
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("relevance");

  const [mobileFilters, setMobileFilters] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  /*
   * Demo data.
   *
   * Replace this with your Meilisearch response later.
   */

  const [results, setResults] =
    useState<SearchProduct[]>(demoProducts);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const filteredResults = results
    .filter((product) => {
      if (category === "All") return true;

      return (
        product.category?.toLowerCase() ===
        category.toLowerCase()
      );
    })
    .sort((a, b) => {
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

  const suggestions = [
    "milk",
    "fresh milk",
    "cow milk",
    "buffalo milk",
    "milk products",
  ].filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  const performSearch = async (term: string) => {
    const cleanTerm = term.trim();

    if (!cleanTerm) {
      setSubmittedQuery("");
      setResults(demoProducts);
      return;
    }

    setSubmittedQuery(cleanTerm);
    setShowSuggestions(false);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/search?q=${encodeURIComponent(cleanTerm)}`
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data: SearchProduct[] = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    }
  };

  useEffect(() => {
    setQuery(routeSearchTerm);
    performSearch(routeSearchTerm);
  }, [routeSearchTerm]);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    performSearch(query);
  };

  const handleSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  const clearSearch = () => {
    setQuery("");
    setSubmittedQuery("");
    setResults(demoProducts);
    setShowSuggestions(false);
  };

  return (
    <div className={style.page}>
      {/* =========================================
          HEADER
      ========================================== */}
      {/* =========================================
          SEARCH AREA
      ========================================== */}

      <main>
        <Header initialQuery={routeSearchTerm} />

        {/* =========================================
            RESULTS
        ========================================== */}

        <section className={style.resultsArea}>
          <div className={style.resultsContainer}>
            {/* MOBILE FILTER BUTTON */}

            <button
              className={style.mobileFilterButton}
              onClick={() =>
                setMobileFilters(true)
              }
            >
              <FilterIcon />
              Filters
            </button>

            {/* =====================================
                FILTER SIDEBAR
            ====================================== */}

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
                  onClick={() =>
                    setMobileFilters(false)
                  }
                >
                  <CloseIcon />
                </button>
              </div>

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
                      onChange={() =>
                        setCategory(item)
                      }
                    />

                    <span
                      className={
                        style.radio
                      }
                    />

                    <span>{item}</span>
                  </label>
                ))}
              </div>

              <div className={style.filterSection}>
                <h3>Availability</h3>

                <label
                  className={style.checkOption}
                >
                  <input
                    type="checkbox"
                    defaultChecked
                  />

                  <span
                    className={
                      style.checkbox
                    }
                  />

                  <span>Available now</span>
                </label>

                <label
                  className={style.checkOption}
                >
                  <input type="checkbox" />

                  <span
                    className={
                      style.checkbox
                    }
                  />

                  <span>Open shops</span>
                </label>
              </div>

              <div className={style.filterSection}>
                <h3>Distance</h3>

                <label
                  className={style.distanceOption}
                >
                  <span>Within 1 km</span>
                  <input
                    type="radio"
                    name="distance"
                  />
                </label>

                <label
                  className={style.distanceOption}
                >
                  <span>Within 3 km</span>
                  <input
                    type="radio"
                    name="distance"
                    defaultChecked
                  />
                </label>

                <label
                  className={style.distanceOption}
                >
                  <span>Within 5 km</span>
                  <input
                    type="radio"
                    name="distance"
                  />
                </label>
              </div>

              <button
                className={style.clearFilters}
                onClick={() =>
                  setCategory("All")
                }
              >
                Clear filters
              </button>
            </aside>

            {/* =====================================
                RESULT CONTENT
            ====================================== */}

            <div className={style.resultsContent}>
              <div className={style.resultsTop}>
                <div>
                  {/* <span className={style.resultLabel}>
                    SEARCH RESULTS
                  </span> */}

                  <h2>
                    {submittedQuery
                      ? `Results for "${submittedQuery}"`
                      : "Discover products near you"}
                  </h2>

                  {/* <p>
                    {filteredResults.length} products
                    found nearby
                  </p> */}
                </div>

                <div className={style.sort}>
                  <label htmlFor="sort">
                    Sort by
                  </label>

                  <select
                    id="sort"
                    value={sort}
                    onChange={(event) =>
                      setSort(event.target.value)
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

              {/* ACTIVE FILTER */}

              {category !== "All" && (
                <div className={style.activeFilters}>
                  <span>Category:</span>

                  <button
                    onClick={() =>
                      setCategory("All")
                    }
                  >
                    {category}
                    <CloseIcon />
                  </button>
                </div>
              )}

              {/* RESULTS */}

              {filteredResults.length > 0 ? (
                <div className={style.resultList}>
                  {filteredResults.map(
                    (product) => (
                      <article
                        className={
                          style.resultItem
                        }
                        key={
                          product.product_id
                        }
                      >
                        <div
                          className={
                            style.productImage
                          }
                        >
                          {product.image_url ? (
                            <img
                              src={
                                product.image_url
                              }
                              alt={
                                product.name
                              }
                            />
                          ) : (
                            <span>
                              Niji
                            </span>
                          )}
                        </div>

                        <div
                          className={
                            style.productInfo
                          }
                        >
                          <div
                            className={
                              style.productCategory
                            }
                          >
                            {product.category ||
                              "Product"}
                          </div>

                          <h3>
                            {product.name}
                          </h3>

                          <p>
                            {product.description ||
                              "Available from a local shop near you."}
                          </p>

                          <div
                            className={
                              style.productMeta
                            }
                          >
                            <strong>
                              {product.shop_name ||
                                "Local Shop"}
                            </strong>

                            <span>•</span>

                            <span>
                              {product.distance
                                ? `${product.distance} km away`
                                : "Nearby"}
                            </span>
                          </div>
                        </div>

                        <div
                          className={
                            style.productPrice
                          }
                        >
                          <span>
                            From
                          </span>

                          <strong>
                            ₹
                            {product.price}
                          </strong>
                        </div>

                        <a
                          href={`/products/${product.product_id}`}
                          className={
                            style.resultAction
                          }
                          aria-label={`View ${product.name}`}
                        >
                          <ArrowIcon />
                        </a>
                      </article>
                    )
                  )}
                </div>
              ) : (
                <div
                  className={
                    style.noResults
                  }
                >
                  <div
                    className={
                      style.noResultsIcon
                    }
                  >
                    <SearchIcon />
                  </div>

                  <h3>
                    Nothing found
                  </h3>

                  <p>
                    We couldn't find anything
                    matching "
                    {submittedQuery || query}
                    ".
                  </p>

                  <button
                    onClick={clearSearch}
                  >
                    Clear search
                  </button>
                </div>
              )}

              {/* PAGINATION */}

              {filteredResults.length > 0 && (
                <div
                  className={
                    style.pagination
                  }
                >
                  <button disabled>
                    Previous
                  </button>

                  <div>
                    <button
                      className={
                        style.currentPage
                      }
                    >
                      1
                    </button>

                    <button>2</button>
                    <button>3</button>
                  </div>

                  <button>
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
