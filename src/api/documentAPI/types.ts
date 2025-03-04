import {Category} from "../categoryAPI/types.ts";
import { Tag } from "../tagsAPI/types.ts";
import {SecretLevel} from "../secretLevelAPI/types.ts";

export interface DocumentType {
    id: number
    name: string
    fileName: string
    format: string
    projectCode: string
    updateDate: Date
    revision: string
    isFinal: boolean
    revisionGroup: string
    category: Category
    secretLevel: SecretLevel
    tags: DocumentTag[] | Tag[]
}

export interface DocumentTag {
    tagId: number
    documentId: number
    tag: Tag
}

export type GetAllDocumentsResponse = { data: DocumentType[], total: number };