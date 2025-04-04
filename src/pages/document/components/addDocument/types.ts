import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
import { GetAllDocumentsResponse } from "../../../../api/documentAPI/types";
import { DocumentType } from "../../../../api/documentAPI/types";
import { Tag } from "../../../../api/tagsAPI/types.ts";

export interface Props {
  open: boolean;
  onClose: () => void;
  refetch: () => Promise<void>;
  documentToEdit?: DocumentType | undefined;
  onDocumentAdded: (documentId: number, file: boolean) => void | null;
}

export interface DocumentFormData extends DocumentType {
  tags: Tag[];
}
