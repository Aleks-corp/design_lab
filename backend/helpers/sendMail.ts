import sgMail from "@sendgrid/mail";
import "dotenv/config";
import { ApiError } from "./index";

const { FRONT_URL, EMAIL_SEND_FROM, SENDGRID_API_KEY } = process.env;

interface Mail {
  email: string;
  verificationToken: string;
}

const sendMail = async ({ email, verificationToken }: Mail) => {
  if (EMAIL_SEND_FROM && SENDGRID_API_KEY) {
    const msg = {
      to: email,
      from: EMAIL_SEND_FROM,
      subject: "Verify Email",
      text: "Your Link to Verify Email adress",
      html: `<a href="${FRONT_URL}/users/verify/${verificationToken}" target:"_blank">Click to verify your Email</a>`,
    };
    sgMail.setApiKey(SENDGRID_API_KEY);
    await sgMail.send(msg);
  } else {
    return ApiError(500, "Mail Server Error");
  }
};

export default sendMail;
