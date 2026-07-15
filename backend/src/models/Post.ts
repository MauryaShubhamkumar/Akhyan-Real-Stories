import { Schema, model, type InferSchemaType } from "mongoose";

const postSchema = new Schema(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    isAnonymous: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
    },

    body: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 20000,
    },

    category: {
      type: String,
      enum: ["struggle", "love", "school", "college", "general"],
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });

export type Post = InferSchemaType<typeof postSchema>;

export const PostModel = model("Post", postSchema);