import { useMutation, UseMutationResult } from "react-query";
import { AxiosError } from "axios";
import { useQuery, UseQueryResult } from "react-query";
import {
  createDocument,
  getAllDocuments,
  getFile,
  restoreRevision,
  uploadDocument,
} from "../../api/documentAPI/document.ts";
import { PaginationModel } from "../../consts/types.ts";
import { GetAllDocumentsResponse } from "../../api/documentAPI/types.ts";
import { DocumentFilters } from "../../pages/document/types.ts";

export const useGetAllDocuments = (
  headers: PaginationModel,
  filters: Partial<DocumentFilters>,
  relations?: string[],
  queryKey?: string
): UseQueryResult<GetAllDocumentsResponse, Error> => {
  return useQuery(
    [queryKey ?? "getAllDocuments", headers],
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

export const useCreateDocument = (): UseMutationResult<
  DocumentType,
  AxiosError,
  Partial<DocumentType>
> => useMutation(createDocument);

export const useRestoreRevision = (): UseMutationResult<
  DocumentType,
  AxiosError,
  string
> => useMutation<DocumentType, AxiosError, string>(restoreRevision);
