import { Request, Response } from "express";
import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AdminAnalyticsService } from "./AdminAnalytice.services";

const getAdminAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminAnalyticsService.fetchAnalytics();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin Analytics Fetched Successfully.",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminAnalyticsService.fetchAllReviews();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "All Reviews Fetched Successfully.",
    data: result,
  });
});

export const AdminAnalyticsController = {
  getAdminAnalytics,
  getAllReviews,
};
