import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";
import { PaymentServices } from "../Payment/Payment.services";
import { ReviewServices } from "./Review.services";

const createReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.createReviewInDB(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Review Created Successfully.",
    data: result,
  });
});
const GetAllReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.GetAllReviewFromDB();

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Reviews fetched Successfully.",
    data: result,
  });
});

export const ReviewControllers = {
  createReview,
  GetAllReview,
};
