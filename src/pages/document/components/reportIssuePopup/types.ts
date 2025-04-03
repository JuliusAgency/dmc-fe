import { DocumentType } from "../../../../api/documentAPI/types";

export interface ReportIssuePopupProps {
  open: boolean;
  onClose: () => void;
  document: DocumentType | null;
}
