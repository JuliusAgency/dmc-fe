export type SentSignatureType = {
  documentId: number;
  name: string;
  revision: number;
  createdAt: string;
  documentPartNumber: string;
  totalSignatures: number;
  signedCount: number;
  rejectedCount: number;
  status: string;
  signers: {
    fullName: string;
    email: string;
    status: string;
    signedAt?: string;
    rejectReason?: string;
  }[];
};
