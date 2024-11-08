import { Schema, model } from "mongoose";
import { handleUpdateValidator, handlerSaveError } from "./hooks.js";

const postSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for post"],
    },
    description: {
      type: String,
      required: [true, "Set description for post"],
    },
    image: {
      type: String,
      required: [true, "Set image link for post"],
    },
    downloadlink: {
      type: String,
      required: [true, "Set download link for post"],
    },
    favorites: {
      type: [Schema.Types.ObjectId],
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

postSchema.post("save", handlerSaveError);

postSchema.pre("findOneAndUpdate", handleUpdateValidator);
postSchema.post("findOneAndUpdate", handlerSaveError);

const Post = model("post", postSchema);

export default Post;
