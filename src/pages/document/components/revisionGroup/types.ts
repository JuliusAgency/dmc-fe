import { Dispatch, SetStateAction } from "react";
import { DocumentType } from "../../../../api/documentAPI/types.ts";

export interface Props {
  documentPartNumber: string;
  rows: DocumentType[];
  setRows: Dispatch<SetStateAction<DocumentType[]>>;
}
