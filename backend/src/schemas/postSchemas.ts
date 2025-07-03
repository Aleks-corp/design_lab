import Joi from "joi";

const postAddSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.base": `'name' should be a type of 'text'`,
    "string.empty": `'name' cannot be an empty field`,
    "any.required": `missing required 'name' field`,
  }),
  description: Joi.alternatives()
    .try(
      Joi.string().messages({ "string.empty": "description cannot be empty" }),
      Joi.object({
        ua: Joi.string()
          .required()
          .messages({ "string.empty": "ua cannot be empty" }),
        en: Joi.string()
          .required()
          .messages({ "string.empty": "en cannot be empty" }),
      })
    )
    .required()
    .messages({
      "any.required": "missing required description field",
      "alternatives.types":
        "description must be a string or object with ua and en",
    }),
  kits: Joi.array().items(Joi.string()).required().messages({
    "string.empty": `'kits' cannot be an empty field`,
    "any.required": `missing required 'kits' field`,
  }),
  category: Joi.array().items(Joi.string()).required().messages({
    "string.empty": `'category' cannot be an empty field`,
    "any.required": `missing required 'category' field`,
  }),
  filesize: Joi.string().required().messages({
    "string.empty": `'filesize' cannot be an empty field`,
    "any.required": `missing required 'filesize' field`,
  }),
  images: Joi.array().items(Joi.string()).required().messages({
    "string.empty": `'image' cannot be an empty field`,
    "any.required": `missing required 'image' field`,
  }),
  downloadlink: Joi.string().required().messages({
    "string.empty": `'downloadlink' cannot be an empty field`,
    "any.required": `missing required 'downloadlink' field`,
  }),
  upload_at: Joi.string().required().messages({
    "string.empty": `'upload_at' cannot be an empty field`,
    "any.required": `missing required 'upload_at' field`,
  }),
});

const postUpdateSchema = Joi.object({
  title: Joi.string().messages({
    "string.base": `'name' should be a type of 'text'`,
    "string.empty": `'name' cannot be an empty field`,
  }),
  description: Joi.alternatives()
    .try(
      Joi.string().messages({ "string.empty": "description cannot be empty" }),
      Joi.object({
        ua: Joi.string()
        .messages({ "string.empty": "ua cannot be empty" }),
        en: Joi.string()
        .messages({ "string.empty": "en cannot be empty" }),
      })
    )
    .messages({
      "any.required": "missing required description field",
      "alternatives.types":
        "description must be a string or object with ua and en",
    }),
  kits: Joi.array().items(Joi.string()).messages({
    "string.empty": `'kits' cannot be an empty field`,
  }),
  category: Joi.array().items(Joi.string()).messages({
    "string.empty": `'category' cannot be an empty field`,
  }),
  images: Joi.array().items(Joi.string()).messages({
    "string.empty": `'image' cannot be an empty field`,
  }),
  upload_at: Joi.string().messages({
    "string.empty": `'upload_at' cannot be an empty field`,
  }),
});

const postUpdateStatusSchema = Joi.object({
  postId: Joi.string().required().messages({
    "string.empty": `'userId' cannot be an empty field`,
    "any.required": `missing required 'userId' field`,
  }),
});

export default { postAddSchema, postUpdateStatusSchema, postUpdateSchema };
