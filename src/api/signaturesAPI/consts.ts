export const SignatureEndpoints = {
  getSignatures: (documentId: number) => `/document-signatures/${documentId}`,
  addSigners: (documentId: number) =>
    `/document-signatures/${documentId}/add-signers`,
  signDocument: (documentId: number, userId: number) =>
    `/document-signatures/${documentId}/sign/${userId}`,
  rejectSignature: (documentId: number, userId: number) =>
    `/document-signatures/${documentId}/reject/${userId}`,
  getDocumentHistory: (revisionGroup: string) =>
    `/document-signatures/history/${revisionGroup}`,
  getPendingSignatures: (userId: number) =>
    `/document-signatures/user/${userId}/pending`,
};
