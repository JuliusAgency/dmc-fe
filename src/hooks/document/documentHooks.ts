import {
  useMutation,
  UseMutationResult,
  useQueryClient,
  useQuery,
  UseQueryResult,
} from "react-query";
import { AxiosError } from "axios";
import {
  createDocument,
  getAllDocuments,
  getFile,
  restoreRevision,
  uploadDocument,
  getLastDocumentPartNumber,
  deleteDocument,
  updateDocumentField,
} from "../../api/documentAPI/document";
import { PaginationModel } from "../../consts/types";
import { GetAllDocumentsResponse } from "../../api/documentAPI/types";
import { DocumentFilters } from "../../pages/document/types";
import { snackBarError, snackBarSuccess } from "../../components/toast/Toast";
import { DocumentType } from "../../api/documentAPI/types";
import {
  DOCUMENT_LOAD_ERROR,
  DOCUMENT_DOWNLOAD_ERROR,
  DOCUMENT_UPLOAD_SUCCESS,
  DOCUMENT_UPLOAD_ERROR,
  DOCUMENT_RESTORE_SUCCESS,
  DOCUMENT_RESTORE_ERROR,
  DOCUMENT_DELETE_SUCCESS,
  DOCUMENT_DELETE_ERROR,
  DOCUMENT_UPDATE_SUCCESS,
  DOCUMENT_UPDATE_ERROR,
  DOCUMENT_PART_NUMBER_ERROR,
} from "./constants";

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
      keepPreviousData: true,
      onError: () => {
        snackBarError(DOCUMENT_LOAD_ERROR);
      },
    }
  );
};

export const useGetFile = (fileName?: string): UseQueryResult<Blob, Error> => {
  return useQuery(["getFile", fileName], () => getFile(fileName!), {
    refetchOnWindowFocus: false,
    enabled: Boolean(fileName),
    onError: () => {
      snackBarError(DOCUMENT_DOWNLOAD_ERROR);
    },
  });
};

export const useUploadDocument = (): UseMutationResult<
  DocumentType,
  AxiosError,
  FormData
> => {
  return useMutation<DocumentType, AxiosError, FormData>(
    async (formData: FormData) => {
      return await uploadDocument(formData);
    },
    {
      onSuccess: () => {
        snackBarSuccess(DOCUMENT_UPLOAD_SUCCESS);
      },
      onError: () => {
        snackBarError(DOCUMENT_UPLOAD_ERROR);
      },
    }
  );
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
> =>
  useMutation<DocumentType, AxiosError, string>(restoreRevision, {
    onSuccess: () => {
      snackBarSuccess(DOCUMENT_RESTORE_SUCCESS);
    },
    onError: () => {
      snackBarError(DOCUMENT_RESTORE_ERROR);
    },
  });

export const useDeleteDocument = (): UseMutationResult<
  void,
  AxiosError,
  number
> => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, number>(
    async (documentId: number) => {
      return await deleteDocument(documentId);
    },
    {
      onSuccess: () => {
        snackBarSuccess(DOCUMENT_DELETE_SUCCESS);

        queryClient.refetchQueries({ queryKey: ["approvedDocs"] });
        queryClient.refetchQueries({ queryKey: ["inProgressDocs"] });
        queryClient.refetchQueries({ queryKey: ["draftDocs"] });
      },
      onError: () => {
        snackBarError(DOCUMENT_DELETE_ERROR);
      },
    }
  );
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      field,
      value,
    }: {
      id: number;
      field: string;
      value: any;
    }) => updateDocumentField(id, field, value),
    onSuccess: () => {
      snackBarSuccess(DOCUMENT_UPDATE_SUCCESS);
      queryClient.refetchQueries({ queryKey: ["approvedDocs"] });
      queryClient.refetchQueries({ queryKey: ["inProgressDocs"] });
      queryClient.refetchQueries({ queryKey: ["draftDocs"] });
    },
    onError: () => {
      snackBarError(DOCUMENT_UPDATE_ERROR);
    },
  });
};

export const useGenerateDocumentPartNumber = (
  docPartNumberTypeId: number | null,
  docPartNumberType: string | null
) => {
  return useQuery(
    ["generateDocumentPartNumber", docPartNumberTypeId],
    async () => {
      if (!docPartNumberTypeId) return null;

      const prefix = docPartNumberType?.slice(0, 3);
      const suffix = docPartNumberType?.slice(-2);
      try {
        const data = await getLastDocumentPartNumber(docPartNumberTypeId);
        let nextNumber = 1;

        if (data?.lastNumber) {
          const match = data.lastNumber.slice(4, 8);

          if (match) {
            nextNumber = parseInt(match, 10) + 1;
          }
        }

        return `${prefix}-${String(nextNumber).padStart(4, "0")}-${suffix}`;
      } catch (error) {
        console.error(DOCUMENT_PART_NUMBER_ERROR, error);
        return `${prefix}-0001-${suffix}`;
      }
    },
    {
      enabled: !!docPartNumberTypeId,
      refetchOnWindowFocus: false,
    }
  );
};
