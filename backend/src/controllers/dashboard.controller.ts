import type { Request, Response } from "express";
import { getDashboardData } from "../services/dashboard.service.js";

export async function getDashboard(
  req: Request,
  res: Response
): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  try {
    const data = await getDashboardData(userId);

    res.status(200).json({
      success: true,
      dashboard: data,
    });
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
