import React from 'react';
import styles from './test.module.css';

export default function ShopDashboard() {
  // Mock data for the active products grid
  const products = [1, 2, 3, 4];

  return (
    <div className={styles['dashboard-page-wrapper']}>
      {/* Main Dashboard Container */}
      <div className={styles['dashboard-container']}>
        
        {/* LEFT COLUMN: Shop Info & Inbox */}
        <div className={styles['sidebar-column']}>
          
          {/* Top Section: Header & Meta */}
          <div className={styles['header-section']}>
            <h1 className={styles['welcome-text']}>WELCOME USER</h1>
            
            <div className={styles['shop-title-group']}>
              <p className={styles['shop-subheading']}>Your Shop</p>
              <h2 className={styles['shop-heading']}>SHOP NAME</h2>
            </div>

            {/* Navigation / Filter Tabs */}
            <div className={styles['navigation-tabs']}>
              <span className={`${styles['tab-item']} ${styles['active-tab']}`}>MAPS</span>
              <span className={styles['tab-item']}>CATEGORY</span>
              <span className={styles['tab-item']}>TAGS</span>
            </div>
          </div>

          {/* Middle Section: Description & Decorative Blocks */}
          <div className={styles['middle-content-row']}>
            {/* Description Box */}
            <div className={styles['description-box']}>
              <span className={styles['box-label']}>Description</span>
              <div className={styles['placeholder-line']}></div>
            </div>

            {/* Feature Square & Pagination/Status Indicators */}
            <div className={styles['status-widget-group']}>
              {/* Large White Block */}
              <div className={styles['feature-square']}></div>
              
              {/* Three Pill Indicators */}
              <div className={styles['indicator-pills-row']}>
                <div className={styles['pill-dot']}></div>
                <div className={styles['pill-dot']}></div>
                <div className={styles['pill-dot']}></div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Inbox Container */}
          <div className={styles['inbox-box']}>
            <span className={styles['box-label']}>Inbox</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Products Showcase */}
        <div className={styles['products-column']}>
          <h3 className={styles['products-heading']}>Active Products</h3>
          
          {/* Products Grid */}
          <div className={styles['products-grid']}>
            {products.map((item) => (
              <div key={item} className={styles['product-card']} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
