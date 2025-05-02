import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import status from "http-status";
import { TComment } from "./Comment.ZodValidations";

const PostCommentInDB = async (payload: TComment) => {
  // return result;
};

const GetAllCommentFromDbByReviewId = async (id: string) => {
  const users = await prisma.payment.findMany({});
  return users;
};

export const CommentServices = {
  PostCommentInDB,
  GetAllCommentFromDbByReviewId,
};
