export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  lat?: number;
  long?: number;
}