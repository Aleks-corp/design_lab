import sgMail from "@sendgrid/mail";
import "dotenv/config";
import { ApiError } from "./index";

const { FRONT_SERVER, FRONT_PORT, EMAIL_SEND_FROM, SENDGRID_API_KEY } =
  process.env;

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
      text: "Your Link to Verify Email adress in Design Lab",
      html: `<a style="
    display: inline-block;
    padding: 10px 20px;
    background-color: #3772FF;
    color: #FCFCFD; 
    text-decoration: none;
    font-size: 16px;
    font-family: Arial, sans-serif;
    border-radius: 5px; 
    border: 2px solid #3772FF; 
    text-align: center;
  " href="http://${FRONT_SERVER}${FRONT_PORT}/verify/${verificationToken}" target:"_blank">Click to verify your Email</a>`,
    };
    sgMail.setApiKey(SENDGRID_API_KEY);
    return await sgMail.send(msg);
  } else {
    return ApiError(500, "Mail Server Error");
  }
};

export default sendMail;
