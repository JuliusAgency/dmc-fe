import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import { GetAllDocumentsResponse } from "../../../../api/documentAPI/types";
import { DocumentType } from "../../../../api/documentAPI/types";
import {Tag} from "../../../../api/tagsAPI/types.ts";

export interface Props {
    open: boolean;
    onClose: () => void;
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<GetAllDocumentsResponse, Error>>;
    documentToEdit?: DocumentType | undefined
}

export interface DocumentFormData extends DocumentType{
    tags: Tag[]
}