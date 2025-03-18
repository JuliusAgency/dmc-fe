import { API } from "../API.ts";

export type SearchReturnType = {
  table: string;
  value: unknown;
};

export const search = async (query: string) => {
  return API.get<SearchReturnType[]>(`/search/${query}`);
};
