import { DocumentSignature } from "../../../../api/documentAPI/types";

export interface displaySignaturesProps {
  open: boolean;
  onClose: () => void;
  documentId: number;
  signatures: DocumentSignature[];
}
