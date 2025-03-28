import { useMutation, UseMutationResult, useQueryClient } from "react-query";
import { AxiosError } from "axios";
import { useQuery, UseQueryResult } from "react-query";
import {
  createDocument,
  getAllDocuments,
  getFile,
  restoreRevision,
  uploadDocument,
  getLastDocumentPartNumber,
  deleteDocument,
  updateDocumentField,
} from "../../api/documentAPI/document.ts";
import { PaginationModel } from "../../consts/types.ts";
import { GetAllDocumentsResponse } from "../../api/documentAPI/types.ts";
import { DocumentFilters } from "../../pages/document/types.ts";
import {
  snackBarError,
  snackBarSuccess,
} from "../../components/toast/Toast.tsx";
import { DocumentType } from "../../api/documentAPI/types.ts";

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
        snackBarError("שגיאה בטעינת המסמכים");
      },
    }
  );
};

export const useGetFile = (fileName?: string): UseQueryResult<Blob, Error> => {
  return useQuery(["getFile", fileName], () => getFile(fileName!), {
    refetchOnWindowFocus: false,
    enabled: Boolean(fileName),
    onError: () => {
      snackBarError("Document download failed!");
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
        snackBarSuccess("Document uploaded successfully");
      },
      onError: () => {
        snackBarError("Document upload failed");
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
      snackBarSuccess("Document restored successfully");
    },
    onError: () => {
      snackBarError("Error restoring document");
    },
  });

export const useDeleteDocument = (): UseMutationResult<
  void,
  AxiosError,
  number
> =>
  useMutation<void, AxiosError, number>(
    async (documentId: number) => {
      await deleteDocument(documentId);
    },
    {
      onSuccess: () => {
        snackBarSuccess("Document deleted successfully");
      },
      onError: () => {
        snackBarError("Error deleting document");
      },
    }
  );

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
      snackBarSuccess("Document updated successfully");

      queryClient.refetchQueries(["getActiveDocuments"]);
      queryClient.refetchQueries(["getInProgressRevision1"]);
      queryClient.refetchQueries(["getDraftRevision1"]);
    },
    onError: () => {
      snackBarError("Error updating document");
    },
  });
};

export const useGenerateDocumentPartNumber = (
  docTypeId: number | null,
  docType: string | null
) => {
  return useQuery(
    ["generateDocumentPartNumber", docTypeId],
    async () => {
      if (!docTypeId) return null;

      const prefix = docType?.slice(0, 3);
      const suffix = docType?.slice(-2);
      try {
        const data = await getLastDocumentPartNumber(docTypeId);
        let nextNumber = 1;

        if (data?.lastNumber) {
          const match = data.lastNumber.slice(4, 8);

          if (match) {
            nextNumber = parseInt(match, 10) + 1;
          }
        }

        return `${prefix}-${String(nextNumber).padStart(4, "0")}-${suffix}`;
      } catch (error) {
        console.error("Error generating documentPartNumber:", error);
        return `${prefix}-0001-${suffix}`;
      }
    },
    {
      enabled: !!docTypeId,
      refetchOnWindowFocus: false,
    }
  );
};
