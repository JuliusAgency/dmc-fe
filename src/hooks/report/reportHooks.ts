import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getReportsForProcessOwner,
  sendReport,
  answerReport,
} from "../../api/reportAPI/report";
import { snackBarError, snackBarSuccess } from "../../components/toast/Toast";
import {
  REPORT_FETCH_ERROR,
  REPORT_SEND_SUCCESS,
  REPORT_SEND_ERROR,
  REPORT_ANSWER_SUCCESS,
  REPORT_ANSWER_ERROR,
} from "./constants";

export const useSendReport = () => {
  const queryClient = useQueryClient();

  return useMutation(sendReport, {
    onSuccess: () => {
      snackBarSuccess(REPORT_SEND_SUCCESS);
      queryClient.invalidateQueries("myReports");
    },
    onError: () => {
      snackBarError(REPORT_SEND_ERROR);
    },
  });
};

export const useGetMyReports = () => {
  return useQuery("myReports", getReportsForProcessOwner, {
    onError: () => snackBarError(REPORT_FETCH_ERROR),
  });
};

export const useAnswerReport = () => {
  const queryClient = useQueryClient();

  return useMutation(answerReport, {
    onSuccess: () => {
      snackBarSuccess(REPORT_ANSWER_SUCCESS);
      queryClient.invalidateQueries("myReports");
    },
    onError: () => {
      snackBarError(REPORT_ANSWER_ERROR);
    },
  });
};
