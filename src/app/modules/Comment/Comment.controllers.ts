import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";
import { CommentServices } from "./Comment.services";

const PostComment = catchAsync(async (req, res) => {
  const result = await CommentServices.PostCommentInDB(req.user, req.body);

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
    meta: {
      total: result.length || 0,
      limit: 0,
      page: 0,
      totalPage: 0
    },
    data: result,
  });
});
const updateComment = catchAsync(async (req, res) => {
  const result = await CommentServices.UpdateCommentOfReview(
    req.user,
    req.params.id!,
    req.body.content
  );

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Comment updated Successfully.",
    data: result,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const result = await CommentServices.DeleteCommentOfReview(
    req.user,
    req.params.id!
  );

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Comment deleted Successfully.",
    data: null,
  });
});

export const CommentControllers = {
  PostComment,
  GetAllCommentById,
  updateComment,
  deleteComment,
};
