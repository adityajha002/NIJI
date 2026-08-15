/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css';

declare module "*.mp4" {
  const src: string;
  export default src;
}

declare module "*.webm" {
  const src: string;
  export default src;
}

declare module "*.ogg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

type AppId = string | number;

interface ApiShop {
  shopid: number;
  shopname: string;
  category: string;
  pincode: string;
  description: string;
  imageurl?: string;
  latitude: number;
  longitude: number;
  userid?: number;
  tags: string[] | string;
  subcategory?: string;
}

interface ApiProduct {
  product_id: AppId;
  name: string;
  description?: string;
  price: number | string;
  category?: string;
  imageurl?: string;
  image_url?: string;
  active?: boolean;
  shop_name?: string;
  shop_id?: number;
  distance?: number;
  [key: string]: unknown;
}

interface SearchProduct {
  product_id: number;
  name: string;
  description?: string;
  price?: number | string;
  category?: string;
  image_url?: string;
  shop_name?: string;
  shop_id?: number;
  distance?: number;
}

interface ProductPreview {
  product_id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
}

interface ShopPreview {
  shop_id: number;
  shop_name: string;
  category: string;
  description: string;
  image_url?: string;
}

interface AddShopFormData {
  image: FileList;
  name: string;
  category: string;
  tags: string;
  address: string;
  pincode: string;
}

interface EditShopFormData {
  shopName: string;
  category: string;
  address: string;
  pincode: string;
  tags: string;
  subCategory: string;
  latitude: number | "";
  longitude: number | "";
}

interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}
