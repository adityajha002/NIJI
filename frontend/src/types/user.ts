export interface User {
  id: string | number;
  username: string;
  name: string;
  role: 'user' | 'shop';
}