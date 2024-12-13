import * as yup from "yup";
import { emailRegexp, passRegexp } from "../constants/user.constants";

export const regSchema = yup.object().shape({
  name: yup.string().min(3).max(12).required(),
  email: yup
    .string()
    .matches(emailRegexp, "Oops! That email doesn't seem right")
    .required(),
  password: yup
    .string()
    .matches(
      passRegexp,
      "Password must contain 8-16 characters, at least one uppercase letter, one lowercase letter and one number:"
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
