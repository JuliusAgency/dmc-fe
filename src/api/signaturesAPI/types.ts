export interface Signature {
  id: number;
  documentId: number;
  userId: number;
  userEmail: string;
  status: "PENDING" | "SIGNED" | "REJECTED";
  signedAt?: string;
}
