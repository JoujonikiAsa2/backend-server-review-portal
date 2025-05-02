import { Prisma } from "@prisma/client";
import { JwtPayload, Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import status from "http-status";
import { TComment } from "./Comment.ZodValidations";

const PostCommentInDB = async (user: JwtPayload, payload: TComment) => {
  console.log("user", user);
  console.log("comment payload", payload);
  // Find User
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });

  if (!isUserExists) throw new ApiError(status.NOT_FOUND, "User Not Found.");

  // Check is review exists
  const isReviewExists = await prisma.review.findUnique({
    where: {
      id: payload.reviewId,
    },
  });
  if (!isReviewExists)
    throw new ApiError(status.NOT_FOUND, "Review Not Found.");

  const result = await prisma.comment.create({
    data: {
      userId: isUserExists.id,
      reviewId: payload.reviewId,
      content: payload.content,
    },
  });

  return result;
};

const GetAllCommentFromDbByReviewId = async (id: string) => {
  const comments = await prisma.comment.findMany({
    where: {
      reviewId: id,
    },
    include: {
      user: {
        select: {
          name: true,
          imageUrl: true,
        },
      },
    },
  });
  return comments;
};

const UpdateCommentOfReview = async (
  user: JwtPayload,
  id: string,
  content: string
) => {
  // Check if the comment user is exists
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });
  if (!isUserExists) throw new ApiError(status.NOT_FOUND, "User Not Found.");
  // Find comment
  const comment = await prisma.comment.findUnique({
    where: {
      userId: isUserExists.id,
      id,
    },
  });

  if (!comment) throw new ApiError(status.NOT_FOUND, "Comment Not Found.");

  const comments = await prisma.comment.update({
    where: {
      id,
    },
    data: {
      content,
    },
  });
  return comments;
};

// Delete comment of review
const DeleteCommentOfReview = async (user: JwtPayload, id: string) => {
  // Check if the comment user is exists
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });
  if (!isUserExists) throw new ApiError(status.NOT_FOUND, "User Not Found.");

  // Find comment
  const comment = await prisma.comment.findUnique({
    where: {
      userId: isUserExists.id,
      id,
    },
  });
  if (!comment) throw new ApiError(status.NOT_FOUND, "Comment Not Found.");

  const result = await prisma.comment.delete({
    where: {
      id,
    },
  });

  return result;
};

export const CommentServices = {
  PostCommentInDB,
  GetAllCommentFromDbByReviewId,
  UpdateCommentOfReview,
  DeleteCommentOfReview,
};
