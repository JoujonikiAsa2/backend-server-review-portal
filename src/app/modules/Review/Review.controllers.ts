import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ReviewServices } from "./Review.services";

const createReview = catchAsync(async (req, res) => {
  const user = { email: req.user.email }; //req.user exists
  const result = await ReviewServices.createReview(user, req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Review Created Successfully.",
    data: result,
  });
});

const GetAllReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.getAllReviews();

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
