import { API_BASE_URL } from '../config/api';

export const fetchProductById = async (productId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(productId)}`);
  if (!response.ok) {
    throw new Error(`Product request failed: ${response.status}`);
  }
  return response.json();
};

export const fetchProductsByShop = async (shopId: string | number, token: string | null) => {
  const response = await fetch(`${API_BASE_URL}/api/products/shop/${shopId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }
  return response.json();
};

export const addProductApi = async (formData: FormData, token: string | null) => {
  const res = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token ?? ''}` },
    body: formData,
  });
  const contentType = res.headers.get('content-type') || '';
  const result = contentType.includes('application/json')
    ? await res.json()
    : { error: await res.text() };
  if (!res.ok) {
    throw new Error(result.error || 'Upload failed');
  }
  return result;
};

export const searchProductsApi = async (queryString: string, signal?: AbortSignal) => {
  const res = await fetch(`${API_BASE_URL}/api/search?${queryString}`, { signal });
  if (!res.ok) {
    throw new Error(`Search failed: ${res.status}`);
  }
  return res.json();
};
