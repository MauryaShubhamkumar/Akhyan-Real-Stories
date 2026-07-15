import { Schema, model, type InferSchemaType } from "mongoose";

const commentSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    body: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({
  postId: 1,
  createdAt: -1,
});

export type Comment = InferSchemaType<
  typeof commentSchema
>;

export const CommentModel = model(
  "Comment",
  commentSchema
);