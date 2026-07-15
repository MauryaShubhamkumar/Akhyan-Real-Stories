import { Schema, model } from "mongoose";

const postViewSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    viewerKey: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

postViewSchema.index(
  {
    postId: 1,
    viewerKey: 1,
  },
  {
    unique: true,
  }
);

export const PostViewModel = model(
  "PostView",
  postViewSchema
);
