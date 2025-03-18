import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { search, SearchReturnType } from "../../api/searchAPI/search.ts";
import { AxiosResponse } from "axios";

export const useSearch = (
  query: string
): UseQueryResult<AxiosResponse<SearchReturnType[]>> => {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => search(query),
    refetchOnWindowFocus: false,
    enabled: !!query,
  });
};
