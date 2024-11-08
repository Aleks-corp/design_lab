import Joi from "joi";

import { emailRegexp, userSubscription } from "../constants/usersConstants.js";

const usersSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "string.pattern.base": `'email' should be a type of 'email'`,
    "string.empty": `'email' cannot be an empty field`,
    "any.required": `missing required 'email' field`,
  }),
  password: Joi.string().min(6).required().messages({
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
