import { API } from "../API.ts";
import { MailEndpoints } from "./consts";
import { SendMailDto } from "./types";

export const sendMail = async (mail: SendMailDto) => {
  return API.post(MailEndpoints.send, mail, { timeout: 60000 });
};
