import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { search, SearchReturnType } from "../../api/searchAPI/search.ts";
import { AxiosResponse } from "axios";

export const useSearch = (
  query: string,
  categoryId?: number | null,
  table?: string
): UseQueryResult<AxiosResponse<SearchReturnType[]>> => {
  return useQuery({
    queryKey: ["search", query, categoryId],
    queryFn: () => search(query, categoryId, table),
    refetchOnWindowFocus: false,
    enabled: !!query,
  });
};
