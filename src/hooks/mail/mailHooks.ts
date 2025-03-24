import { useMutation } from "@tanstack/react-query";
import { sendMail } from "../../api/mailAPI";
import { SendMailDto } from "../../api/mailAPI/types";

export const useSendMail = () => {
  return useMutation({
    mutationFn: (mail: SendMailDto) => sendMail(mail),
  });
};
