import Joi from "joi";

const postAddSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.base": `'name' should be a type of 'text'`,
    "string.empty": `'name' cannot be an empty field`,
    "any.required": `missing required 'name' field`,
  }),

  description: Joi.string().required().messages({
    "string.empty": `'description' cannot be an empty field`,
    "any.required": `missing required 'description' field`,
  }),
  image: Joi.string().required().messages({
    "string.empty": `'description' cannot be an empty field`,
    "any.required": `missing required 'description' field`,
  }),
  downloadlink: Joi.string().required().messages({
    "string.empty": `'description' cannot be an empty field`,
    "any.required": `missing required 'description' field`,
  }),
  kits: Joi.array().items(Joi.string()).required().messages({
    "string.empty": `'description' cannot be an empty field`,
    "any.required": `missing required 'description' field`,
  }),
  favorites: Joi.array().items(Joi.string()).required().messages({
    "string.empty": `'description' cannot be an empty field`,
    "any.required": `missing required 'description' field`,
  }),
  filter: Joi.array().items(Joi.string()).required().messages({
    "string.empty": `'description' cannot be an empty field`,
    "any.required": `missing required 'description' field`,
  }),
});

const postUpdateStatusSchema = Joi.object({
  favorite: Joi.string().required(),
});

export default { postAddSchema, postUpdateStatusSchema };