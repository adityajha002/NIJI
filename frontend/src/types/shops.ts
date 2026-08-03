export interface Shop {
  shopid: number;
  shopname: string;
  category: string;
  pincode: string;
  description: string;
  imageurl?: string;
  latitude: number;
  longitude: number;
  userid: number;
  tags: string[];
}

export interface ShopFormData {
  image: FileList;
  name: string;
  category: string;
  tags: string;
  address: string;
  pincode: string;
}