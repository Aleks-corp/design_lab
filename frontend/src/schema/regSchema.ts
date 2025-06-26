import * as yup from "yup";
import {
  emailRegexp,
  passRegexp,
  phoneRegexp,
} from "../constants/user.constants";
import { validationMessages } from "../constants/validationMessages.constant";

export const getRegSchema = (lang: "EN" | "UA") => {
  const t = validationMessages[lang];

  return yup.object().shape({
    name: yup.string().min(3).max(18).required(t.required),
    email: yup.string().matches(emailRegexp, t.email).required(t.required),
    phone: yup
      .string()
      .matches(phoneRegexp, t.phone)
      .min(12)
      .max(16)
      .required(t.required),
    password: yup
      .string()
      .matches(passRegexp, t.passFormat)
      .required(t.required),
    confpass: yup
      .string()
      .matches(passRegexp, t.passFormat)
      .oneOf([yup.ref("password")], t.passMismatch)
      .required(t.required),
  });
};

export const getChangePassSchema = (lang: "EN" | "UA") => {
  const t = validationMessages[lang];

  return yup.object().shape({
    oldPassword: yup
      .string()
      .matches(passRegexp, t.passFormat)
      .required(t.required),
    newPassword: yup
      .string()
      .matches(passRegexp, t.passFormat)
      .required(t.required),
    confpass: yup
      .string()
      .matches(passRegexp, t.passFormat)
      .oneOf([yup.ref("newPassword")], t.passMismatch)
      .required(t.required),
  });
};

export const getForgotPassSchema = (lang: "EN" | "UA") => {
  const t = validationMessages[lang];

  return yup.object().shape({
    email: yup.string().matches(emailRegexp, t.email).required(t.required),
  });
};

export const getResetPassSchema = (lang: "EN" | "UA") => {
  const t = validationMessages[lang];

  return yup.object().shape({
    password: yup
      .string()
      .matches(passRegexp, t.passFormat)
      .required(t.required),
    confpass: yup
      .string()
      .matches(passRegexp, t.passFormat)
      .oneOf([yup.ref("password")], t.passMismatch)
      .required(t.required),
  });
};

export const getLoginSchema = (lang: "EN" | "UA") => {
  const t = validationMessages[lang];

  return yup.object().shape({
    email: yup.string().matches(emailRegexp, t.email).required(t.required),
    password: yup
      .string()
      .matches(passRegexp, t.passFormat)
      .required(t.required),
  });
};
