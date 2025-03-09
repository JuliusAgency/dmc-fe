import { API } from "../API.ts";
import { Category } from "./types.ts";
import { CategoryEndpoints } from "./consts.ts";

export const getAllCategories = async (): Promise<Category[]> => {
  const { data } = await API.get(CategoryEndpoints.getAllCategories);

  return data;
};

export const createCategory = async (name: string) => {
  return API.post(CategoryEndpoints.createCategory, { name });
};

export async function deleteCategory(id: number) {
  await API.delete(CategoryEndpoints.deleteCategory(id));
}
