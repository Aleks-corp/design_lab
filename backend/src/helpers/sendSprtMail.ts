import nodemailer from "nodemailer";
import "dotenv/config";

import { SMTP } from "../constants/mail.constants";
import { ApiError } from "./index";

const { EMAIL_REPORT_SEND, EMAIL_SEND_FROM, EMAIL_PASS } = process.env;

interface Mail {
  email: string;
  message: string;
}

const sendMailToSprt = async ({ email, message }: Mail) => {
  if (!EMAIL_REPORT_SEND || !EMAIL_PASS || !EMAIL_SEND_FROM) {
    return ApiError(500, "Mail Server Error");
  }

  const transporter = nodemailer.createTransport({
    host: SMTP.HOST,
    port: SMTP.PORT,
    secure: true,
    auth: {
      user: EMAIL_SEND_FROM,
      pass: EMAIL_PASS,
    },
  });

  return await transporter.sendMail({
    from: EMAIL_SEND_FROM,
    to: EMAIL_REPORT_SEND,
    subject: `Report designualab from ${email}`,
    text: `Report from ${email}. ${" "}
              Message: ${message}.`,
  });
};

export default sendMailToSprt;

// const sendMailToSprt = async ({ email, message }: Mail) => {
//   if (EMAIL_SEND_FROM && SENDGRID_API_KEY) {
//     const msg = {
//       to: EMAIL_REPORT_SEND,
//       from: EMAIL_SEND_FROM,
//       subject: `Report designualab from ${email}`,
//       text: `Report from ${email}. ${" "}
//               Message: ${message}.`,
//     };
//     sgMail.setApiKey(SENDGRID_API_KEY);
//     return await sgMail.send(msg);
//   } else {
//     return ApiError(500, "Mail Server Error");
//   }
// };
