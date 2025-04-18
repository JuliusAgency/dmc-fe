import { PaginationModel } from "../../consts/types.ts";
import { API } from "../API.ts";
import { DocumentEndpoints } from "./consts.ts";
import { GetAllDocumentsResponse } from "./types.ts";
import { DocumentFilters } from "../../pages/document/types.ts";
import { DocumentType } from "./types.ts";

export const getAllDocuments = async (
  headers: PaginationModel,
  filters: Partial<DocumentFilters>,
  relations?: string[]
): Promise<GetAllDocumentsResponse> => {
  let transformedFilters: Record<string, any> = {};

  const setFilterParams: Map<
    string,
    { description: string; action: () => void }
  > = new Map([
    [
      "isFinal",
      {
        description: "גרסת קובץ סופית",
        action: () => {
          const isFinal = filters["isFinal"];
          if (isFinal === true || isFinal === false) {
            transformedFilters = {
              ...transformedFilters,
              isFinal,
            };
          }
        },
      },
    ],
    [
      "documentPartNumber",
      {
        description: "documentPartNumber",
        action: () => {
          const documentPartNumber = filters["documentPartNumber"];
          if (documentPartNumber) {
            transformedFilters = {
              ...transformedFilters,
              documentPartNumber,
            };
          }
        },
      },
    ],
    [
      "categoryId",
      {
        description: "categoryId",
        action: () => {
          const categoryId = filters["categoryId"];
          if (categoryId) {
            transformedFilters = {
              ...transformedFilters,
              categoryId,
            };
          }
        },
      },
    ],
    [
      "status",
      {
        description: "status",
        action: () => {
          const status = filters["status"];
          if (Array.isArray(status)) {
            transformedFilters.status = { in: status };
          } else if (typeof status === "string") {
            transformedFilters.status = status;
          }
        },
      },
    ],
    [
      "revision",
      {
        description: "revision",
        action: () => {
          const revision = filters["revision"];
          if (revision) {
            transformedFilters = {
              ...transformedFilters,
              revision: Number(revision),
            };
          }
        },
      },
    ],
  ]);

  Object.keys(filters).forEach((field) => {
    const addToQueryParams = setFilterParams.get(field)?.action;
    if (addToQueryParams) {
      addToQueryParams();
    }
  });
  const { data } = await API.get(DocumentEndpoints.getAllDocuments, {
    params: {
      filters: JSON.stringify(transformedFilters),
      relations: JSON.stringify(relations || []),
    },
    headers: {
      "page-size": headers.pageSize,
      "page-number": headers.page,
    },
  });

  return data;
};

export const uploadDocument = async (formData: FormData) => {
  const { data } = await API.post<DocumentType>(
    DocumentEndpoints.uploadDocument,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

export const createDocument = (
  document: Partial<DocumentType>
): Promise<DocumentType> => {
  return API.post(DocumentEndpoints.createDocument, document);
};

export const restoreRevision = async (id: string): Promise<DocumentType> => {
  const { data } = await API.post<DocumentType>(
    `${DocumentEndpoints.restoreRevision}${id}`
  );
  return data;
};

export const getFile = async (fileName: string): Promise<Blob> => {
  const response = await API.get(`${DocumentEndpoints.getFile}${fileName}`, {
    responseType: "blob",
  });
  return response.data;
};

export const getLastDocumentPartNumber = async (
  docPartNumberTypeId: number
) => {
  const response = await API.get(DocumentEndpoints.lastDocumentPartNumber, {
    params: { docPartNumberTypeId },
  });
  return response.data;
};

export const deleteDocument = async (documentId: number): Promise<void> => {
  try {
    await API.delete(DocumentEndpoints.deleteDocument(documentId));
  } catch (error) {
    throw new Error("Failed to delete document");
  }
};

export const updateDocumentField = async (
  documentId: number,
  field: string,
  value: Partial<DocumentType>
): Promise<DocumentType> => {
  try {
    const { data } = await API.patch<DocumentType>(
      DocumentEndpoints.updateDocumentField(documentId, field),
      { value }
    );

    return data;
  } catch (error) {
    throw new Error("Failed to update document");
  }
};
