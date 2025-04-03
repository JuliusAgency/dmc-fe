import { API } from "../API.ts";

export type SearchReturnType = {
  table: string;
  value: any;
};

export const search = async (
  query: string,
  categoryId?: number | null,
  table?: string
) => {
  const params: Record<string, string> = { query };
  if (categoryId != 0) {
    params.categoryId = String(categoryId);
  }

  if (table) {
    params.table = table;
  }

  return API.get<SearchReturnType[]>("/search", { params });
};
