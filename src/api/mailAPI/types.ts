export interface SendMailDto {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
}
