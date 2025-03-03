// src/hooks/document/documentHooks.ts
import { useQuery, UseQueryResult } from "react-query";
import {getAllDocuments} from "../../api/documentAPI/document.ts";
import {PaginationModel} from "../../consts/types.ts";
import { GetAllDocumentsResponse} from "../../api/documentAPI/types.ts";

export const useGetAllDocuments = (
    headers: PaginationModel,
    relations?: string[],
): UseQueryResult<GetAllDocumentsResponse, Error> => {
    return useQuery(
        ["getAllDocuments", headers, relations],
        () => getAllDocuments(headers, relations),
        {
            refetchOnWindowFocus: false,
        },
    );
};