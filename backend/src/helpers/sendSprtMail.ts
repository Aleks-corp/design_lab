import sgMail from "@sendgrid/mail";
import "dotenv/config";
import { ApiError } from "./index";

const { EMAIL_REPORT_SEND, EMAIL_SEND_FROM, SENDGRID_API_KEY } = process.env;

interface Mail {
  email: string;
  message: string;
}

const sendMailToSprt = async ({ email, message }: Mail) => {
  if (EMAIL_SEND_FROM && SENDGRID_API_KEY) {
    const msg = {
      to: EMAIL_REPORT_SEND,
      from: EMAIL_SEND_FROM,
      subject: `Report designualab from ${email}`,
      text: `Message: ${message}`,
    };
    sgMail.setApiKey(SENDGRID_API_KEY);
    return await sgMail.send(msg);
  } else {
    return ApiError(500, "Mail Server Error");
  }
};

export default sendMailToSprt;
