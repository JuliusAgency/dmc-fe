export interface ReportRow {
  id: number;
  documentId: number;
  document: {
    name: string;
  };
  revision?: number | null;
  reporterName: string;
  reportedAt: string | Date;
  message: string;
  response?: string | null;
}
