import api from './auth';
import { Product, ProductCreate, ProductUpdate, Feedback } from '../types/product';
import { MessageResponse } from '../types/auth';

// Product API functions
export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>('/api/v1/products/');
  return response.data;
};

export const createProduct = async (productData: ProductCreate): Promise<Product> => {
  const response = await api.post<Product>('/api/v1/products/', productData);
  return response.data;
};

export const getProduct = async (productId: string): Promise<Product> => {
  const response = await api.get<Product>(`/api/v1/products/${productId}`);
  return response.data;
};

export const updateProduct = async (productId: string, productData: ProductUpdate): Promise<Product> => {
  const response = await api.put<Product>(`/api/v1/products/${productId}`, productData);
  return response.data;
};

export const deleteProduct = async (productId: string): Promise<MessageResponse> => {
  const response = await api.delete<MessageResponse>(`/api/v1/products/${productId}`);
  return response.data;
};

export const getProductFeedback = async (productId: string): Promise<Feedback[]> => {
  const response = await api.get<Feedback[]>(`/api/v1/products/${productId}/feedback`);
  return response.data;
};