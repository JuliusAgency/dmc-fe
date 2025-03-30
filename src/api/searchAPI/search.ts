import { API } from "../API.ts";

export type SearchReturnType = {
  table: string;
  value: unknown;
};

export const search = async (query: string, categoryId?: number | null) => {
  const params: Record<string, string> = { query };
  if (categoryId != 0) {
    params.categoryId = String(categoryId);
  }

  return API.get<SearchReturnType[]>("/search", { params });
};
