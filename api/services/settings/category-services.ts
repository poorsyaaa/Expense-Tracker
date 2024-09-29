import { DefaultOptions } from "@/api/types";
import {
  CategoriesResponse,
  Category,
  CategoryResponse,
} from "@/api/types/settings";
import axiosInstance from "@/lib/axiosInstance";
import {
  CategorySchema,
  DeleteCategorySchema,
  PaginationSchema,
} from "@/lib/schema/settings";

export const getCategories = async (
  options: DefaultOptions<PaginationSchema, never, never>,
) => {
  const { endpoint, queryParams, signal } = options;

  const response = await axiosInstance.get<CategoriesResponse>(
    endpoint ?? "/settings/category",
    {
      params: queryParams,
      signal,
    },
  );

  return response.data;
};

export const createCategory = async (
  options: DefaultOptions<never, CategorySchema, never>,
) => {
  const { endpoint, data, signal } = options;

  const response = await axiosInstance.post<{
    message: string;
    category: Category;
  }>(endpoint ?? "/settings/category", data, {
    signal,
  });
  return response.data;
};

export const updateCategory = async (
  options: DefaultOptions<never, CategorySchema, { categoryId: string }>,
) => {
  const { endpoint, data, pathParams, signal } = options;

  const response = await axiosInstance.put<{
    message: string;
    category: Category;
  }>(endpoint ?? `/settings/category/${pathParams?.categoryId}`, data, {
    signal,
  });

  return response.data;
};

export const getCategory = async (
  options: DefaultOptions<never, never, { categoryId: string }>,
) => {
  const { endpoint, pathParams, signal } = options;

  const response = await axiosInstance.get<CategoryResponse>(
    endpoint ?? `/settings/category/${pathParams?.categoryId}`,
    {
      signal,
    },
  );

  return response.data;
};

export const deleteCategory = async (
  options: DefaultOptions<never, DeleteCategorySchema, { categoryId: string }>,
) => {
  const { endpoint, pathParams, data, signal } = options;

  const response = await axiosInstance.delete(
    endpoint ?? `/settings/category/${pathParams?.categoryId}`,
    {
      signal,
      data,
    },
  );

  return response.data;
};
