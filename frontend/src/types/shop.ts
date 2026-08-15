export interface ApiShop {
  shopid: number;
  shopname: string;
  category: string;
  subcategory?: string;
  description?: string;
  pincode?: string;
  tags?: string | string[];
  imageurl?: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
}

export interface ShopPreview {
  shop_id?: number | string;
  shop_name?: string;
  category?: string;
  description?: string;
  image_url?: string;
}

export interface AddShopFormData {
  name: string;
  category: string;
  tags: string;
  address: string;
  pincode: string;
  image?: FileList;
}

export interface EditShopFormData {
  shopName: string;
  category: string;
  address: string;
  pincode: string;
  tags: string;
  subCategory: string;
  latitude: number | string;
  longitude: number | string;
}
