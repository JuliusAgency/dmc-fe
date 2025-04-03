export const ReportEndpoints = {
  sendReport: "/report",
  getMyReport: "/report/my",
  answerReport: (reportId: number) => `/report/${reportId}/response`,
  deleteReport: (id: number) => `/report/${id}`,
};
