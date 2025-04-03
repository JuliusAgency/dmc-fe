import { API } from "../API.ts";
import { ReportEndpoints } from "./consts";

export const sendReport = async ({
  documentId,
  revision,
  reporterName,
  message,
}: {
  documentId: number;
  revision?: number;
  reporterName: string;
  message: string;
}) => {
  const { data } = await API.post(ReportEndpoints.sendReport, {
    documentId,
    revision,
    reporterName,
    message,
  });
  return data;
};

export const getReportsForProcessOwner = async () => {
  const { data } = await API.get(ReportEndpoints.getMyReport);
  return data;
};

export const getAllReports = async () => {
  const { data } = await API.get(ReportEndpoints.getAllReports);
  return data;
};

export const answerReport = async ({
  reportId,
  response,
}: {
  reportId: number;
  response: string;
}) => {
  const { data } = await API.patch(ReportEndpoints.answerReport(reportId), {
    response,
  });
  return data;
};

export const deleteReport = async (reportId: number) => {
  const { data } = await API.delete(ReportEndpoints.deleteReport(reportId));
  return data;
};
