import { DocumentType } from "../../../../api/documentAPI/types";

export interface Props {
  open: boolean;
  onClose: () => void;
  document: DocumentType | null;
}
