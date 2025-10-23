export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  sku: string;
  barcode?: string;
  isActive?: boolean;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductsResponse {
  items: Product[];
  limit: number;
  offset: number;
  total: number;
}
export interface ProductCreate
  extends Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface ProductUpdate extends Partial<ProductCreate> {}
