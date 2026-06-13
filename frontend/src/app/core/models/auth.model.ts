export interface User {
  username: string;
  role: 'admin' | 'guest';
  token: string;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  user: User;
}
