import Joi from "joi";

import {
  emailRegexp,
  passRegexp,
  userSubscription,
} from "../constants/usersConstants.js";

const usersSchema = Joi.object({
  name: Joi.string().required().min(3).max(12).messages({
    "string.empty": `'email' cannot be an empty field`,
    "any.required": `missing required 'name' field`,
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "string.pattern.base": `'email' should be a type of 'email'`,
    "string.empty": `'email' cannot be an empty field`,
    "any.required": `missing required 'email' field`,
  }),
  password: Joi.string()
    .min(8)
    .max(16)
    .pattern(passRegexp)
    .required()
    .messages({
      "string.pattern.base": `'password' contain minimum 8 characters, at least one uppercase letter, one lowercase letter and one number`,
      "string.empty": `'password' cannot be an empty field`,
      "any.required": `missing required 'password' field`,
    }),
  subscription: Joi.string().valid(...userSubscription),
});

const usersUpdateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...userSubscription)
    .required()
    .messages({
      "string.empty": `'subscription' cannot be an empty field`,
      "any.required": `missing required 'subscription' field`,
    }),
});

const usersVerifySchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "string.pattern.base": `'email' should be a type of 'email'`,
    "string.empty": `'email' cannot be an empty field`,
    "any.required": `missing required 'email' field`,
  }),
});

export default {
  usersSchema,
  usersUpdateSubscriptionSchema,
  usersVerifySchema,
};
