// src/api/documentAPI/document.ts
import {PaginationModel} from "../../consts/types.ts";
import {API} from "../API.ts";
import {DocumentEndpoints} from "./consts.ts";
import {GetAllDocumentsResponse} from "./types.ts";

export const getAllDocuments = async (
    headers: PaginationModel,
    relations?: string[],
): Promise<GetAllDocumentsResponse> => {

    const { data } = await API.get(DocumentEndpoints.getAllDocuments, {
        params: {
            filters: JSON.stringify({}),
            relations: JSON.stringify(relations || []),
        },
        headers: {
            "page-size": headers.pageSize,
            "page-number": headers.page
        },
    });

    return data;
}