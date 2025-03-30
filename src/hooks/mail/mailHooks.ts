import { useMutation } from "@tanstack/react-query";
import { sendMail } from "../../api/mailAPI";
import { SendMailDto } from "../../api/mailAPI/types";
import { snackBarSuccess, snackBarError } from "../../components/toast/Toast";
import { MAIL_SEND_SUCCESS, MAIL_SEND_ERROR } from "./constants";

export const useSendMail = () => {
  return useMutation({
    mutationFn: (mail: SendMailDto) => sendMail(mail),
    onSuccess: () => {
      snackBarSuccess(MAIL_SEND_SUCCESS);
    },
    onError: () => {
      snackBarError(MAIL_SEND_ERROR);
    },
  });
};
