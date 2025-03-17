export interface Signature {
  id: number;
  documentId: number;
  userId: number;
  userEmail: string;
  status: "PENDING" | "SIGNED" | "REJECTED";
  signedAt?: string;
}

export interface DocumentHistory {
  id: number;
  documentPartNumber: string;
  revision: number;
  createdAt: string;
  status: "DRAFT" | "IN_PROGRESS" | "SIGNED" | "REJECTED";
  signatures: Signature[];
}
