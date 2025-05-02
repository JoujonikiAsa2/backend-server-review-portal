import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";
import { CommentServices, PaymentServices } from "./Comment.services";

const PostComment = catchAsync(async (req, res) => {
  const result = await CommentServices.PostCommentInDB(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Comment uploaded Successfully.",
    data: result,
  });
});
const GetAllCommentById = catchAsync(async (req, res) => {
  const result = await CommentServices.GetAllCommentFromDbByReviewId(
    req.params.id!
  );

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Comment data fetched Successfully.",
    data: result,
  });
});

export const CommentControllers = {
  PostComment,
  GetAllCommentById,
};
