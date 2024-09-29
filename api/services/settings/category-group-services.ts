import { DefaultOptions } from "@/api/types";
import { CategoryGroup, CategoryGroupResponse } from "@/api/types/settings";
import axiosInstance from "@/lib/axiosInstance";
import { CategoryGroupSchema } from "@/lib/schema/settings";

export const getCategoryGroups = async (options: DefaultOptions) => {
  const { endpoint, signal } = options;

  const response = await axiosInstance.get<CategoryGroupResponse>(
    endpoint ?? "/settings/category-group",
    {
      signal,
    },
  );

  return response.data;
};

export const createCategoryGroup = async (
  options: DefaultOptions<never, CategoryGroupSchema, never>,
) => {
  const { endpoint, data, signal } = options;

  const response = await axiosInstance.post<{
    message: string;
    categoryGroup: Omit<CategoryGroup, "categories">;
  }>(endpoint ?? "/settings/category-group", data, {
    signal,
  });

  return response.data;
};

export const updateCategoryGroup = async (
  options: DefaultOptions<
    never,
    CategoryGroupSchema,
    { categoryGroupId: string }
  >,
) => {
  const { endpoint, data, pathParams, signal } = options;

  const response = await axiosInstance.put<{
    message: string;
    categoryGroup: Omit<CategoryGroup, "categories">;
  }>(
    endpoint ?? `/settings/category-group/${pathParams?.categoryGroupId}`,
    data,
    {
      signal,
    },
  );

  return response.data;
};

export const deleteCategoryGroup = async (
  options: DefaultOptions<never, never, { categoryGroupId: string }>,
) => {
  const { endpoint, pathParams, signal, headers } = options;

  const response = await axiosInstance.delete(
    endpoint ?? `/settings/category-group"/${pathParams?.categoryGroupId}`,
    {
      signal,
      headers,
    },
  );

  return response.data;
};
