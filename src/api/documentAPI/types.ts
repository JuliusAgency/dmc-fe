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
}

export type GetAllDocumentsResponse = { data: DocumentType[], total: number };