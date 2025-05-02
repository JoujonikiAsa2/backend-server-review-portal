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
  });
  return comments;
};

export const CommentServices = {
  PostCommentInDB,
  GetAllCommentFromDbByReviewId,
};
