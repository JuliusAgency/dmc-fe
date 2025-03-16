import { useMutation, UseMutationResult } from "react-query";
import { AxiosError } from "axios";
import { useQuery, UseQueryResult } from "react-query";
import {
  createDocument,
  getAllDocuments,
  getFile,
  restoreRevision,
  uploadDocument,
  getLastDocumentPartNumber,
} from "../../api/documentAPI/document.ts";
import { PaginationModel } from "../../consts/types.ts";
import { GetAllDocumentsResponse } from "../../api/documentAPI/types.ts";
import { DocumentFilters } from "../../pages/document/types.ts";
import {
  snackBarError,
  snackBarSuccess,
} from "../../components/toast/Toast.tsx";

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
      snackBarError("❌ Document download failed!");
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

export const useGenerateDocumentPartNumber = (
  docTypeId: number | null,
  docType: string | null
) => {
  return useQuery(
    ["generateDocumentPartNumber", docTypeId],
    async () => {
      if (!docTypeId) return null;

      try {
        const data = await getLastDocumentPartNumber(docTypeId);
        let nextNumber = 1;

        if (data) {
          const match = data.match(/-(\d+)-WI$/);
          if (match) {
            nextNumber = parseInt(match[1], 10) + 1;
          }
        }
        return `${docType}-${String(nextNumber).padStart(4, "0")}-WI`;
      } catch (error) {
        console.error("Error generating documentPartNumber:", error);
        return `${docType}-0001-WI`;
      }
    },
    {
      enabled: !!docTypeId,
      refetchOnWindowFocus: false,
    }
  );
};
