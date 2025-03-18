export interface Document {
  id: number;
  name: string;
  revision: string;
  createdAt: string;
  fileName: string;
  categoryId: string;
}

export interface PendingSignature {
  id: number;
  documentId: number;
  document: Document;
}
