import React, { FormEvent, KeyboardEvent, useMemo, useState } from "react";
import style from "./search.module.css";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  shop: string;
  category: string;
  distance: number;
  image: string;
  stock: boolean;
  location: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Fresh Full Cream Milk",
    description:
      "Fresh dairy milk from a nearby local dairy. Delivered fresh every morning.",
    price: 68,
    shop: "Sharma Dairy",
    category: "Dairy",
    distance: 0.7,
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",
    stock: true,
    location: "Sector 14 Market",
  },
  {
    id: 2,
    name: "Organic Cow Milk",
    description:
      "Pure cow milk sourced from a local dairy with no added preservatives.",
    price: 72,
    shop: "Green Farm Dairy",
    category: "Dairy",
    distance: 1.2,
    image:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80",
    stock: true,
    location: "Main Market",
  },
  {
    id: 3,
    name: "Amul Taaza Milk",
    description:
      "Fresh packaged milk available for immediate pickup from the nearby store.",
    price: 64,
    shop: "Gupta General Store",
    category: "Dairy",
    distance: 1.8,
    image:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80",
    stock: true,
    location: "Block C Market",
  },
  {
    id: 4,
    name: "Buffalo Milk",
    description:
      "Rich and creamy buffalo milk supplied fresh from a neighborhood dairy.",
    price: 78,
    shop: "Verma Dairy",
    category: "Dairy",
    distance: 2.4,
    image:
      "https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&w=600&q=80",
    stock: false,
    location: "Old Market Road",
  },
  {
    id: 5,
    name: "Fresh Curd",
    description:
      "Homemade-style fresh curd prepared daily by a local dairy.",
    price: 55,
    shop: "Sharma Dairy",
    category: "Dairy",
    distance: 0.7,
    image:
      "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=600&q=80",
    stock: true,
    location: "Sector 14 Market",
  },
];

const categories = [
  { name: "All categories", count: 128 },
  { name: "Dairy", count: 32 },
  { name: "Groceries", count: 41 },
  { name: "Fruits & Vegetables", count: 26 },
  { name: "Bakery", count: 17 },
  { name: "Snacks", count: 12 },
];

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={style.icon}
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={style.arrowIcon}
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={style.smallIcon}
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
      <circle cx="9" cy="6" r="2" />
      <circle cx="15" cy="12" r="2" />
      <circle cx="11" cy="18" r="2" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={style.metaIcon}
    >
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function Search() {
  const [query, setQuery] = useState("milk");
  const [submittedQuery, setSubmittedQuery] = useState("milk");
  const [category, setCategory] = useState("All categories");
  const [sort, setSort] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (category !== "All categories") {
      result = result.filter((product) => product.category === category);
    }

    if (sort === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "distance") {
      result = [...result].sort((a, b) => a.distance - b.distance);
    }

    return result;
  }, [category, sort]);

  const suggestions = [
    "milk",
    "organic milk",
    "cow milk",
    "buffalo milk",
    "milk products",
  ];

  const submitSearch = (event?: FormEvent) => {
    event?.preventDefault();

    const cleanedQuery = query.trim();

    if (!cleanedQuery) {
      return;
    }

    setSubmittedQuery(cleanedQuery);
    setSuggestionsOpen(false);

    /*
      Replace this section with your Meilisearch request.

      Example:

      const response = await fetch(
        `${API_URL}/search?q=${encodeURIComponent(cleanedQuery)}`
      );

      const data = await response.json();

      setResults(data.hits);
    */
  };

  const handleSearchKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Escape") {
      setSuggestionsOpen(false);
    }
  };

  const chooseSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setSubmittedQuery(suggestion);
    setSuggestionsOpen(false);
  };

  return (
    <main className={style.page}>
      {/* ───────────────── HEADER ───────────────── */}

      <header className={style.header}>
        <div className={style.headerInner}>
          <a href="/" className={style.logo}>
            niji<span>.</span>
          </a>

          <div className={style.headerLocation}>
            <MapPinIcon />

            <div>
              <span className={style.locationLabel}>Shopping near</span>
              <strong>New Delhi</strong>
            </div>
          </div>

          <nav className={style.headerNav}>
            <a href="/">Home</a>
            <a href="/shops">Shops</a>
            <a href="/about">About</a>
          </nav>

          <button className={style.profileButton} aria-label="Open account">
            AJ
          </button>
        </div>
      </header>

      {/* ───────────────── SEARCH HERO ───────────────── */}

      <section className={style.searchHero}>
        <div className={style.heroInner}>
          <p className={style.eyebrow}>LOCAL SEARCH</p>

          <h1 className={style.heroTitle}>
            Find it.
            <br />
            <span>Nearby.</span>
          </h1>

          <p className={style.heroDescription}>
            Search products from shops around you and discover
            what&apos;s available locally.
          </p>

          <form
            role="search"
            className={style.searchForm}
            onSubmit={submitSearch}
          >
            <SearchIcon />

            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSuggestionsOpen(true);
              }}
              onFocus={() => setSuggestionsOpen(true)}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search products"
              placeholder="Search for milk, vegetables, snacks..."
              autoComplete="off"
            />

            {query && (
              <button
                type="button"
                className={style.clearSearch}
                onClick={() => {
                  setQuery("");
                  setSuggestionsOpen(false);
                }}
                aria-label="Clear search"
              >
                ×
              </button>
            )}

            <button
              type="submit"
              className={style.searchButton}
              aria-label="Search"
            >
              <ArrowIcon />
            </button>

            {suggestionsOpen && query && (
              <div className={style.suggestions}>
                <div className={style.suggestionHeader}>
                  <span>Suggestions</span>
                  <span>↵ to search</span>
                </div>

                {suggestions
                  .filter((item) =>
                    item.toLowerCase().includes(query.toLowerCase())
                  )
                  .slice(0, 5)
                  .map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className={style.suggestion}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => chooseSuggestion(suggestion)}
                    >
                      <SearchIcon />
                      <span>{suggestion}</span>
                      <ArrowIcon />
                    </button>
                  ))}
              </div>
            )}
          </form>

          <div className={style.quickSearches}>
            <span>Try</span>

            <button onClick={() => chooseSuggestion("milk")}>
              Milk
            </button>

            <button onClick={() => chooseSuggestion("vegetables")}>
              Vegetables
            </button>

            <button onClick={() => chooseSuggestion("bread")}>
              Bread
            </button>

            <button onClick={() => chooseSuggestion("snacks")}>
              Snacks
            </button>
          </div>
        </div>
      </section>

      {/* ───────────────── RESULTS ───────────────── */}

      <section className={style.resultsSection}>
        <div className={style.resultsLayout}>
          {/* ───────── FILTER RAIL ───────── */}

          <aside
            className={`${style.filterRail} ${
              showFilters ? style.filterRailOpen : ""
            }`}
          >
            <div className={style.filterHeading}>
              <div>
                <span className={style.filterKicker}>REFINE</span>
                <h2>Filters</h2>
              </div>

              <button
                className={style.clearFilters}
                onClick={() => setCategory("All categories")}
              >
                Clear
              </button>
            </div>

            <fieldset className={style.filterGroup}>
              <legend>Category</legend>

              {categories.map((item) => (
                <label
                  key={item.name}
                  className={style.filterOption}
                >
                  <input
                    type="radio"
                    name="category"
                    checked={category === item.name}
                    onChange={() => setCategory(item.name)}
                  />

                  <span className={style.customRadio} />

                  <span className={style.filterName}>
                    {item.name}
                  </span>

                  <span className={style.filterCount}>
                    {item.count}
                  </span>
                </label>
              ))}
            </fieldset>

            <fieldset className={style.filterGroup}>
              <legend>Availability</legend>

              <label className={style.filterOption}>
                <input type="checkbox" defaultChecked />

                <span className={style.customCheckbox} />

                <span className={style.filterName}>
                  Available now
                </span>
              </label>

              <label className={style.filterOption}>
                <input type="checkbox" />

                <span className={style.customCheckbox} />

                <span className={style.filterName}>
                  Open nearby
                </span>
              </label>
            </fieldset>

            <fieldset className={style.filterGroup}>
              <legend>Distance</legend>

              <label className={style.distanceOption}>
                <span>Within 1 km</span>
                <input type="radio" name="distance" />
              </label>

              <label className={style.distanceOption}>
                <span>Within 3 km</span>
                <input type="radio" name="distance" defaultChecked />
              </label>

              <label className={style.distanceOption}>
                <span>Within 5 km</span>
                <input type="radio" name="distance" />
              </label>
            </fieldset>
          </aside>

          {/* ───────── RESULTS CONTENT ───────── */}

          <div className={style.resultsContent}>
            <div className={style.mobileToolbar}>
              <button
                className={style.mobileFilterButton}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersIcon />
                Filters
              </button>

              <span>
                {filteredProducts.length} results
              </span>
            </div>

            <div className={style.resultsHeader}>
              <div>
                <p className={style.resultsKicker}>
                  SEARCH RESULTS
                </p>

                <h2>
                  Results for{" "}
                  <span>&quot;{submittedQuery}&quot;</span>
                </h2>

                <p
                  className={style.resultCount}
                  role="alert"
                >
                  Showing {filteredProducts.length} nearby products
                </p>
              </div>

              <div className={style.sortWrapper}>
                <label htmlFor="sort">Sort</label>

                <select
                  id="sort"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="distance">Nearest first</option>
                  <option value="price-low">
                    Price: low to high
                  </option>
                </select>
              </div>
            </div>

            {/* ───────── ACTIVE FILTERS ───────── */}

            <div className={style.activeFilters}>
              {category !== "All categories" && (
                <button
                  onClick={() => setCategory("All categories")}
                >
                  {category}
                  <span>×</span>
                </button>
              )}

              <span className={style.locationChip}>
                <MapPinIcon />
                Within 3 km
              </span>
            </div>

            {/* ───────── RESULT LIST ───────── */}

            <ol className={style.resultsList}>
              {filteredProducts.map((product, index) => (
                <li
                  key={product.id}
                  className={style.resultRow}
                >
                  <span className={style.resultNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className={style.productImageWrapper}>
                    <img
                      src={product.image}
                      alt=""
                      className={style.productImage}
                    />
                  </div>

                  <div className={style.productMain}>
                    <div className={style.productTopLine}>
                      <span className={style.productCategory}>
                        {product.category}
                      </span>

                      {product.stock ? (
                        <span className={style.available}>
                          Available
                        </span>
                      ) : (
                        <span className={style.unavailable}>
                          Currently unavailable
                        </span>
                      )}
                    </div>

                    <a
                      href={`/products/${product.id}`}
                      className={style.productName}
                    >
                      {product.name}
                    </a>

                    <p className={style.productDescription}>
                      {product.description}
                    </p>

                    <div className={style.productMeta}>
                      <span className={style.shopName}>
                        {product.shop}
                      </span>

                      <span className={style.metaDivider}>·</span>

                      <span>{product.location}</span>

                      <span className={style.metaDivider}>·</span>

                      <span>{product.distance} km away</span>
                    </div>
                  </div>

                  <div className={style.productPrice}>
                    <span className={style.priceLabel}>
                      FROM
                    </span>

                    <strong>₹{product.price}</strong>
                  </div>

                  <a
                    href={`/products/${product.id}`}
                    className={style.resultArrow}
                    aria-label={`View ${product.name}`}
                  >
                    <ArrowIcon />
                  </a>
                </li>
              ))}
            </ol>

            {/* ───────── PAGINATION ───────── */}

            <nav
              className={style.pagination}
              aria-label="Search results pagination"
            >
              <button disabled>← Previous</button>

              <div className={style.pageNumbers}>
                <button
                  className={style.currentPage}
                  aria-current="page"
                >
                  1
                </button>

                <button>2</button>
                <button>3</button>
                <span>...</span>
                <button>8</button>
              </div>

              <button>
                Next <span>→</span>
              </button>
            </nav>
          </div>
        </div>
      </section>

      {/* ───────────────── FOOTER ───────────────── */}

      <footer className={style.footer}>
        <div>
          <span className={style.footerLogo}>
            niji<span>.</span>
          </span>

          <p>Discover your local market.</p>
        </div>

        <span>Made for local.</span>
      </footer>
    </main>
  );
}

export default Search;