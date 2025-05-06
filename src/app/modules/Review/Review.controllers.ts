import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ReviewServices } from "./Review.services";
import { pick } from "../../../helpers/pick";
import { Request } from "express";

const createReview = catchAsync(async (req, res) => {
  //req.user exists
  const result = await ReviewServices.createReview(req.user, req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Review Created Successfully.",
    data: result,
  });
});

const GetAllReview = catchAsync(async (req, res) => {
  const filterData = pick(req.query, [
    "searchTerm",
    "title",
    "category",
    "RatingSummary",
    "startDate",
    "endDate",
  ]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await ReviewServices.getAllReviews(filterData, options);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Reviews Fetched Successfully.",
    meta: result.meta,
    data: result.data,
  });
});

// const GetReviewById = catchAsync(async (req, res) => {
//   const result = await ReviewServices.getAllReviewByIdFromDB(req.params.id);

//   sendResponse(res, {
//     statusCode: status.OK,
//     success: true,
//     message: "Review Fetched Successfully.",
//     data: result,
//   });
// });
const GetReviewById = catchAsync(async (req, res) => {
  const { action } = req.query;
  const result = await ReviewServices.getAllReviewByIdFromDB(
    req.params.id,
    action as string
  );

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Reviews fetched Successfully.",
    data: result,
  });
});
// Update review
const updateReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.updateReviewInDB(
    req.user,
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Review Updated Successfully.",
    data: result,
  });
});

// Delete review
const deleteReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.deleteReviewInDB(req.params.id, req.user);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Review Deleted Successfully.",
    data: null,
  });
});

const updateVotes = catchAsync(async (req: Request & { user?: any }, res) => {
  const user = req?.user;
  const result = await ReviewServices.updateVotesInDB(
    user,
    req.params.id,
    req?.query?.voteType as string
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Vote Updated Successfully.",
    data: result,
  });
});

const getReviewCount = catchAsync(async (req, res) => {
  //req.user exists
  const result = await ReviewServices.getReviewCountFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: `Review Count ${result}.`,
    data: result,
  });
});
const getMyReviews = catchAsync(async (req, res) => {
  const result = await ReviewServices.getMyReviewsromDB(req.user);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Reviews fetchedd Successfully.",
    data: result,
  });
});

const updateReviewStatus = catchAsync(async (req, res) => {
  const result = await ReviewServices.updateReviewStatus(req.params.reviewId, req.query.actionType as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Review Published Successfully.",
    data: result,
  });
});


export const ReviewControllers = {
  createReview,
  GetAllReview,
  updateVotes,
  GetReviewById,
  updateReview,
  deleteReview,
  getReviewCount,
  getMyReviews,
  updateReviewStatus
};
