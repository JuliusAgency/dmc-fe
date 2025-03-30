import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "react-query";
import { GetAllDocumentsResponse } from "../../../../api/documentAPI/types";

export interface SelectSignersPopupProps {
  open: boolean;
  onClose: () => void;
  documentId: number | null;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<GetAllDocumentsResponse, Error>>;
}

export interface Option {
  id: number;
  name: string;
  typeId?: string;
  type?: "user" | "group";
  originalId?: number;
  users?: { id: number; email: string }[];
}
