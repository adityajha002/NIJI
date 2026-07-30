import React, { useState } from 'react'
import style from './addShopSec2.module.css'




const AddShopSec2 = () => {



  return (
    <div className={style.main}>
      <div className={style.productsGrid}>
        {showAddProduct ? (
          <AddProductForm
            onCancel={() => setShowAddProduct(false)}
            onSuccess={handleSuccess}
          />
        ) : (
          <>
            {/* your existing product cards would map here */}
            <AddProduct onClick={() => setShowAddProduct(true)} />
          </>
        )}
      </div>
    </div>
  );
};

export default AddShopSec2