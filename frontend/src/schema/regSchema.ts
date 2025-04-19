import * as yup from "yup";
import {
  emailRegexp,
  passRegexp,
  phoneRegexp,
} from "../constants/user.constants";

export const regSchema = yup.object().shape({
  name: yup.string().min(3).max(18).required(),
  email: yup
    .string()
    .matches(emailRegexp, "Oops! That email doesn't seem right")
    .required(),
  // .test(
  //   "not-temp-email",
  //   "Temporary emails are not allowed",
  //   async (value) => {
  //     if (!value) return true;
  //     const domain = value.split("@")[1]?.toLowerCase();
  //     const { default: tempEmailDomainsSet } = await import(
  //       "../constants/temp-email-domains"
  //     );
  //     return !tempEmailDomainsSet.has(domain);
  //   }
  // ),
  phone: yup
    .string()
    .matches(phoneRegexp, "Oops! That phone doesn't seem right")
    .min(12)
    .max(16)
    .required(),
  password: yup
    .string()
    .matches(
      passRegexp,
      "Password must contain 8-18 characters, at least one uppercase letter, one lowercase letter and one number:"
    )
    .required(),
  confpass: yup
    .string()
    .matches(
      passRegexp,
      "Password must contain 8-16 characters, at least one uppercase letter, one lowercase letter and one number:"
    )
    .required()
    .oneOf([yup.ref("password")], "Passwords do not match"),
});
