import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import {GetAllDocumentsResponse} from "../../../../api/documentAPI/types.ts";

export interface Props {
    revisionGroup: string
    refetchMainDocuments: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<GetAllDocumentsResponse, Error>>;
}