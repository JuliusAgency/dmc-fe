import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import { GetAllDocumentsResponse } from "../../../../api/documentAPI/types";

export interface Props {
    open: boolean;
    onClose: () => void;
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<GetAllDocumentsResponse, Error>>;
    documentToEdit?: DocumentType
}