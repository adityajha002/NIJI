export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}
