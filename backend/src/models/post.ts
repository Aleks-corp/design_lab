import { Schema, model } from "mongoose";
import { handleUpdateValidator, handlerSaveError } from "./hooks";
import { kits } from "../constants/kitsConstants";
import { category } from "../constants/categoryConstants";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set name for post"],
    },
    description: {
      type: String,
      required: [true, "Set description for post"],
    },
    images: {
      type: [String],
      required: [true, "Set array of images link for post"],
    },
    downloadlink: {
      type: String,
      required: [true, "Set download link for post"],
    },
    kits: {
      type: [String],
      required: [true, "Set at least one kits"],
      validate: {
        validator: function (value: string[]) {
          const allowedValues = kits;
          return (
            value.every((item: string) => allowedValues.includes(item)) &&
            value.length > 0
          );
        },
        message: "Filter can only contain 'figma', 'react', or 'html'.",
      },
    },
    filesize: {
      type: String,
      required: [true, "Set filesize for file"],
    },
    favorites: {
      type: [Schema.Types.ObjectId],
      ref: "user",
      required: true,
    },
    category: {
      type: [String],
      required: [true, "Set at least one category"],
      validate: {
        validator: function (value: string[]) {
          const allowedValues = category;
          return (
            value.every((item: string) => allowedValues.includes(item)) &&
            value.length > 0
          );
        },
        message:
          "Kits can only contain 'All products', 'Web', 'Mobile', 'Dashboard', 'Health', 'Finance'.",
      },
    },
    upload_at: { type: Date, required: true },
  },

  { versionKey: false, timestamps: true }
);

postSchema.post("save", handlerSaveError);

postSchema.pre("findOneAndUpdate", handleUpdateValidator);
postSchema.post("findOneAndUpdate", handlerSaveError);

const Post = model("post", postSchema);

export default Post;
