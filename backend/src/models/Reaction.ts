import { Schema, model, type InferSchemaType } from "mongoose";

const reactionSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

reactionSchema.index(
  { postId: 1, userId: 1 },
  { unique: true }
);

export type Reaction = InferSchemaType<typeof reactionSchema>;

export const ReactionModel = model(
  "Reaction",
  reactionSchema
);