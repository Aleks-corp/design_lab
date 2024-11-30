import { Schema, model } from "mongoose";
import { handleUpdateValidator, handlerSaveError } from "./hooks";
import { kits } from "../constants/kitsConstants";
import { filter } from "../constants/filterConstants";

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
    image: {
      type: [String],
      required: [true, "Set image link for post"],
    },
    downloadlink: {
      type: String,
      required: [true, "Set download link for post"],
    },
    kits: {
      type: [String],
      required: [true, "Set at least one filter"],
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
    filter: {
      type: [String],
      required: [true, "Set at least one kits"],
      validate: {
        validator: function (value: string[]) {
          const allowedValues = filter;
          return (
            value.every((item: string) => allowedValues.includes(item)) &&
            value.length > 0
          );
        },
        message:
          "Kits can only contain 'All products', 'Web', 'Mobile', 'Dashboard', 'Health', 'Finance'.",
      },
    },
  },

  { versionKey: false, timestamps: true }
);

postSchema.post("save", handlerSaveError);

postSchema.pre("findOneAndUpdate", handleUpdateValidator);
postSchema.post("findOneAndUpdate", handlerSaveError);

const Post = model("post", postSchema);

export default Post;
