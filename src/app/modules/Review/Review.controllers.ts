import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ReviewServices } from "./Review.services";
import { pick } from "../../../helpers/pick.";

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
  ]);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await ReviewServices.getAllReviews(filterData, options);
  console.log("filterData", filterData);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    meta: {
      total: result.length,
      page: Number(options.page) || 1,
      limit: Number(options.limit) || 10,
    },
    message: "Reviews fetched Successfully.",
    data: result,
  });
});

const GetReviewById = catchAsync(async (req, res) => {
  const result = await ReviewServices.getAllReviewByIdFromDB(req.params.id);

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
    statusCode: status.CREATED,
    success: true,
    message: "Review updated Successfully.",
    data: result,
  });
});

// Delete review
const deleteReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.deleteReviewInDB(req.params.id, req.user);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Review deleted Successfully.",
    data: result,
  });
});

const updateVotes = catchAsync(async (req, res) => {
  const result = await ReviewServices.updateVotesInDB(
    req.params.id,
    req?.query?.voteType as string
  );

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Vote updated Successfully.",
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
};
