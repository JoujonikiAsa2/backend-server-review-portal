import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { findUserByEmail } from "../../../helpers/userHelpers";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import bcrypt from "bcrypt";
import status from "http-status";
import { TReview } from "./Review.ZodValidations";

const createReviewInDB = async (payload: TReview) => {
  return;
};

const GetAllReviewFromDB = async () => {
  const users = await prisma.review.findMany({});
  return users;
};

export const ReviewServices = {
  createReviewInDB,
  GetAllReviewFromDB,
};
