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
  const { data } = await API.post(ReportEndpoints.SEND_REPORT, {
    documentId,
    revision,
    reporterName,
    message,
  });
  return data;
};

export const getReportsForProcessOwner = async () => {
  const { data } = await API.get(ReportEndpoints.GET_MY_REPORTS);
  return data;
};

export const answerReport = async ({
  reportId,
  response,
}: {
  reportId: number;
  response: string;
}) => {
  const { data } = await API.patch(ReportEndpoints.ANSWER_REPORT(reportId), {
    response,
  });
  return data;
};
