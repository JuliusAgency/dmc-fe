import { useMutation, UseMutationResult } from "react-query";
import { AxiosError } from "axios";
import { useQuery, UseQueryResult } from "react-query";
import {
  getAllDocuments,
  getFile,
  uploadDocument,
} from "../../api/documentAPI/document.ts";
import { PaginationModel } from "../../consts/types.ts";
import { GetAllDocumentsResponse } from "../../api/documentAPI/types.ts";
import { DocumentFilters } from "../../pages/document/types.ts";

export const useGetAllDocuments = (
  headers: PaginationModel,
  filters: DocumentFilters,
  relations?: string[]
): UseQueryResult<GetAllDocumentsResponse, Error> => {
  return useQuery(
    ["getAllDocuments", headers, relations],
    () => getAllDocuments(headers, filters, relations),
    {
      refetchOnWindowFocus: false,
    }
  );
};

export const useUploadDocument = (): UseMutationResult<
  DocumentType[],
  AxiosError,
  any
> => {
  return useMutation<DocumentType[], AxiosError, any>(uploadDocument, {});
};

export const useGetFile = (fileName?: string): UseQueryResult<Blob, Error> => {
  return useQuery(["getFile", fileName], () => getFile(fileName!), {
    refetchOnWindowFocus: false,
    enabled: Boolean(fileName),
  });
};
