import { API_BASE_URL } from '../config/api';
import { ApiError } from '../utils/apiError';

export const loginApi = async (data: { username: string; password: string }) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(result.error || 'Unable to login', res.status);
  }
  return result;
};

export const registerApi = async (data: { username: string; name: string; password: string }) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(result.error || 'Unable to sign up', res.status);
  }
  return result;
};
