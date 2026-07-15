import type { Request, Response } from "express";
import mongoose from "mongoose";

import { ReportModel } from "../models/Report.js";
import { PostModel } from "../models/Post.js";
import { CommentModel } from "../models/Comment.js";
import { createReportSchema } from "../schemas/report.schema.js";

export const createReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = createReportSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message:
        result.error.issues[0]?.message ?? "Invalid report",
    });

    return;
  }

  const { targetType, targetId, reason } = result.data;

  if (!mongoose.isValidObjectId(targetId)) {
    res.status(400).json({
      success: false,
      message: "Invalid target ID",
    });

    return;
  }

  try {
    const targetExists =
      targetType === "post"
        ? await PostModel.exists({ _id: targetId })
        : await CommentModel.exists({ _id: targetId });

    if (!targetExists) {
      res.status(404).json({
        success: false,
        message: `${targetType} not found`,
      });

      return;
    }

    const report = await ReportModel.create({
      targetType,
      targetId,
      reporterId: req.userId,
      reason,
    });

    res.status(201).json({
      success: true,
      report: {
        id: report.id,
        status: report.status,
      },
      message: "Report submitted successfully",
    });
  } catch (error) {
    if (
      error instanceof mongoose.mongo.MongoServerError &&
      error.code === 11000
    ) {
      res.status(409).json({
        success: false,
        message: "You have already reported this content",
      });

      return;
    }

    console.error("Create report error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};