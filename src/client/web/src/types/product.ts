export interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  checklink: string;
  status: string;
  image_url?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  name: string;
  description?: string;
  category?: string;
}

export interface ProductUpdate {
  name?: string;
  description?: string;
  category?: string;
  status?: string;
}

export interface Feedback {
  id: string;
  email?: string;
  rating?: number;
  comment?: string;
  product_id: string;
  created_at: string;
}