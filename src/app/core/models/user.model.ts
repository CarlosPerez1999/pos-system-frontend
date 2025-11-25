export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: 'seller' | 'admin';
  isActive?: boolean;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  items: User[];
  limit: number;
  offset: number;
  total: number;
}

export interface authResponse {
  access_token: string;
}
export interface UserCreate
  extends Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface Me {
  valid: boolean;
  payload: {
    exp: number;
    iat: number;
    role: 'seller' | 'admin';
    sub: string;
    username: string;
  };
}

export interface UserUpdate extends Partial<UserCreate> {}
