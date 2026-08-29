import { api } from "../api/client";
import { endpoints } from "../api/endpoints";
import { ApiResponse, PaginatedResponse } from "../types/api";
import { Product, SearchParams } from "../types/product";

export const productService = {
  async getProducts(params?: SearchParams) {
    return api.get<PaginatedResponse<Product> | ApiResponse<Product[]>>(endpoints.products, { params });
  },
  async getProduct(id: string) {
    return api.get<ApiResponse<Product> | Product>(`${endpoints.products}${id}/`);
  },
  async createProduct(product: Partial<Product>) {
    return api.post<ApiResponse<Product>>(endpoints.products, product);
  },
  async updateProduct(id: string, product: Partial<Product>) {
    return api.patch<ApiResponse<Product>>(`${endpoints.products}${id}/`, product);
  },
  async deleteProduct(id: string) {
    return api.delete<void>(`${endpoints.products}${id}/`);
  },
};
