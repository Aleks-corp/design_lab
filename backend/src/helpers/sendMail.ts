import sgMail from "@sendgrid/mail";
import "dotenv/config";
import { ApiError } from "./index";

const { FRONT_SERVER, EMAIL_SEND_FROM, SENDGRID_API_KEY } = process.env;

interface Mail {
  email: string;
  verificationToken: string;
  path: string;
  text: string;
}

const sendMail = async ({ email, verificationToken, path, text }: Mail) => {
  if (EMAIL_SEND_FROM && SENDGRID_API_KEY) {
    const msg = {
      to: email,
      from: EMAIL_SEND_FROM,
      subject: "Verify Email",
      text: "Your Link to Verify Email adress in Design Lab",
      html: `<p style="
    padding: 10px 20px;
    margin 0 auto;
    background-color: #151617;
    color: #FCFCFD; 
    text-decoration: none;
    font-size: 16px;
    font-family: Arial, sans-serif;
    border-radius: 5px; 
    border: 2px solid #3772FF; 
    text-align: center;
  ">DesignUA Lab</p><a style="
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
  " href="${FRONT_SERVER}/${path}/${verificationToken}" target:"_blank">${text}</a><p>If you didn't request this, please ignore this email</p>`,
    };
    sgMail.setApiKey(SENDGRID_API_KEY);
    return await sgMail.send(msg);
  } else {
    return ApiError(500, "Mail Server Error");
  }
};

export default sendMail;
