import { User } from "../authAPI/types";

export interface Signature {
  id: number;
  documentId: number;
  userId: number;
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
