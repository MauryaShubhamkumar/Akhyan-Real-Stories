import { Schema, model, type InferSchemaType } from "mongoose";

const reportSchema = new Schema(
  {
    targetType: {
      type: String,
      enum: ["post", "comment"],
      required: true,
    },

    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    reporterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["pending", "reviewed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index(
  {
    targetType: 1,
    targetId: 1,
    reporterId: 1,
  },
  {
    unique: true,
  }
);

export type Report = InferSchemaType<typeof reportSchema>;

export const ReportModel = model("Report", reportSchema);