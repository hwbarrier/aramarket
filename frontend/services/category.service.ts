import { api } from "../api/client";
import { endpoints } from "../api/endpoints";
import { ApiResponse } from "../types/api";
import { ProductCategory } from "../types/category";

export const categoryService = {
  async getCategories() {
    return api.get<ApiResponse<ProductCategory[]>>(endpoints.categories);
  },
};
