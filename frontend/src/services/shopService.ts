import { API_BASE_URL } from '../config/api';
import { ApiError } from '../utils/apiError';

export const fetchShopById = async (shopId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/shops/${shopId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch the shop');
  }
  return response.json();
};

export const fetchShopsByCategory = async (category: string) => {
  const res = await fetch(`${API_BASE_URL}/api/shops/loadCategory/${encodeURIComponent(category)}`);
  if (!res.ok) {
    throw new Error(`Failed to load shops (${res.status})`);
  }
  return res.json();
};

export const fetchShopDashboard = async (token: string | null) => {
  const response = await fetch(`${API_BASE_URL}/api/shops/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(
      result.error || `Failed to fetch shop dashboard (${response.status})`,
      response.status
    );
  }
  return result;
};

export const createShopApi = async (formData: FormData, token: string | null) => {
  const res = await fetch(`${API_BASE_URL}/api/shops/addShop`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const contentType = res.headers.get('content-type') || '';
  const result = contentType.includes('application/json') ? await res.json().catch(() => ({})) : {};
  if (!res.ok) {
    throw new Error(result.error || `Failed to save shop (${res.status})`);
  }
  return result;
};

export const updateShopDashboard = async (data: Record<string, unknown>, token: string | null) => {
  const response = await fetch(`${API_BASE_URL}/api/shops/dashboard`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const result = await response.json().catch(() => ({})) as { error?: string };
  if (!response.ok) {
    throw new ApiError(
      result.error || `Failed to update shop (${response.status})`,
      response.status
    );
  }
  return result;
};
