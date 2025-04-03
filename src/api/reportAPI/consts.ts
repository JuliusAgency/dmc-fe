export const ReportEndpoints = {
  sendReport: "/report",
  getMyReport: "/report/my",
  getAllReports: "/report",
  answerReport: (reportId: number) => `/report/${reportId}/response`,
  deleteReport: (id: number) => `/report/${id}`,
};
