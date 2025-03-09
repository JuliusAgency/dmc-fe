import {Dispatch, SetStateAction } from "react";
import {DocumentType} from "../../../../api/documentAPI/types.ts";

export interface Props {
    revisionGroup: string
    rows: DocumentType[]
    setRows: Dispatch<SetStateAction<DocumentType[]>>
}