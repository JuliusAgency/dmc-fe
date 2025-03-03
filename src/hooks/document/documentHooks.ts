import { useMutation, UseMutationResult } from "react-query";
import { AxiosError } from "axios";

import { useQuery, UseQueryResult } from "react-query";
import {getAllDocuments, uploadDocument} from "../../api/documentAPI/document.ts";
import {PaginationModel} from "../../consts/types.ts";
import { GetAllDocumentsResponse} from "../../api/documentAPI/types.ts";
import {DocumentEndpoints} from "../../api/documentAPI/consts.ts";

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

export const useUploadDocument = (): UseMutationResult<DocumentType[], AxiosError, any> => {
    return useMutation<DocumentType[], AxiosError, any>(uploadDocument, {
    });
};