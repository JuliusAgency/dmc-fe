import { API } from "../API.ts";
import { Category } from "./types.ts";
import { CategoryEndpoints } from "./consts.ts";

export const getAllCategories = async (): Promise<Category[]> => {
  const { data } = await API.get(CategoryEndpoints.getAllCategories, {
    params: {
      relations: JSON.stringify(["childCategories", "parentCategory"]),
    },
    headers: {
      "page-size": 1000,
      "page-number": 0,
    },
  });

  return data?.data;
};

export interface CreateCategoryDto {
  name: string;
  parentCategoryId?: number;
}

export const createCategory = async (categoryData: CreateCategoryDto) => {
  return API.post(CategoryEndpoints.createCategory, categoryData);
};

export async function deleteCategory(id: number) {
  await API.delete(CategoryEndpoints.deleteCategory(id));
}
