export const ReportEndpoints = {
  SEND_REPORT: "/report",
  GET_MY_REPORTS: "/report/my",
  ANSWER_REPORT: (reportId: number) => `/report/${reportId}/response`,
};
