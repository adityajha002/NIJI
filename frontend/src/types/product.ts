import { ShopPreview } from './shop';

export interface ProductPreview {
  product_id: number;
  name: string;
  description?: string;
  price: number;
  category?: string;
  image_url?: string;
}

export interface ApiProduct {
  product_id: number;
  name: string;
  description?: string;
  price: number | string;
  category?: string;
  imageurl?: string;
  image_url?: string;
  active?: boolean;
  shopid?: number;
}

export interface SearchProduct extends ProductPreview {
  shop_name?: string;
  distance?: number;
}

export interface ProductPageData extends ProductPreview {
  shop?: ShopPreview;
  shop_id?: number | string;
  shop_name?: string;
  shop_category?: string;
  shop_description?: string;
  shop_image_url?: string;
}
