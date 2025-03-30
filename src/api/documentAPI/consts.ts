export const DocumentEndpoints = {
  uploadDocument: "/document/upload",
  getAllDocuments: "/document/",
  getFile: "/document/",
  createDocument: "/document/",
  restoreRevision: "/document/restore/",
  lastDocumentPartNumber: "/document/last-part-number",
  deleteDocument: (documentId: number) => `/document/${documentId}`,
  updateDocumentField: (documentId: number, field: string) =>
    `/document/${documentId}/${field}`,
};
