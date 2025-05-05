import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";
import { CommentServices } from "./Comment.services";

const PostComment = catchAsync(async (req, res) => {
  const result = await CommentServices.PostCommentInDB(req.user, req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Comment Uploaded Successfully.",
    data: result,
  });
});

const GetAllCommentById = catchAsync(async (req, res) => {
  const result = await CommentServices.GetAllCommentFromDbByReviewId(
    req.params.id!
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Comments Fetched Successfully.",
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
    statusCode: status.OK,
    success: true,
    message: "Comment Updated Successfully.",
    data: result,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const result = await CommentServices.DeleteCommentOfReview(
    req.user,
    req.params.id!
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Comment Deleted Successfully.",
    data: null,
  });
});

export const CommentControllers = {
  PostComment,
  GetAllCommentById,
  updateComment,
  deleteComment,
};
