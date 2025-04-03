import { User } from "../authAPI/types";
import { DocumentType } from "../documentAPI/types";

export interface Signature {
  id: number;
  documentId: number;
  document: DocumentType;
  userId: number;
  user: User[];
  userEmail: string;
  status: "PENDING" | "SIGNED" | "REJECTED";
  signedAt?: string;
}

export interface SignatureGroup {
  id: number;
  name: string;
  createdAt: string;
  users: User[];
}
