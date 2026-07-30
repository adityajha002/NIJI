import React from "react";
import style from "./productcard.module.css";
import useAuth from "../../../context/useAuth";
import {useState, useEffect} from "react";


export default function ProductCard({
  image,
  name,
  price,
  stockCount,
  inStock = true,
  onEdit,
  onStockChange,
}) {
  const [isInStock, setIsInStock] = useState(inStock);

  const toggleStock = () => {
    const next = !isInStock;
    setIsInStock(next);
    onStockChange?.(next);
  };

  return (
    <div className={`${style.card} ${!isInStock ? style.cardOut : ""}`}>
      <div className={style.photoWrap}>
        <img src={image} alt={name} className={style.photo} />

        <span className={`${style.stockChip} ${!isInStock ? style.stockChipOut : ""}`}>
          {isInStock ? "In stock" : "Out of stock"}
        </span>

        <button
          type="button"
          className={style.edit}
          onClick={onEdit}
          aria-label="Edit product"
        >
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path
              d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z"
              fill="none"
              stroke="#6B7785"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className={style.info}>
        <p className={style.name}>{name}</p>

        <div className={style.priceRow}>
          <p className={style.price}>
            <span className={style.priceRupee}>₹</span>
            {price.toLocaleString("en-IN")}
          </p>
          <p className={style.stockCount}>{stockCount} left</p>
        </div>

        <div className={style.divider} />

        <div className={style.toggleRow}>
          <span className={style.toggleLabel}>Visible to buyers</span>
          <button
            type="button"
            className={`${style.switch} ${isInStock ? style.switchOn : ""}`}
            onClick={toggleStock}
            role="switch"
            aria-checked={isInStock}
            aria-label="Toggle stock availability"
          >
            <span className={style.switchThumb} />
          </button>
        </div>
      </div>
    </div>
  );
}
