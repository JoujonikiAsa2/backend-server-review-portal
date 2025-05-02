import { Prisma, Review } from "@prisma/client";
import prisma from "../../shared/prisma";
import { TReview } from "./Review.ZodValidations";
import ApiError from "../../errors/ApiError";
import status from "http-status";

const createReview = async (
  user: { email: string },
  payload: TReview
): Promise<Review> => {
  console.log("payload", payload);
  console.log("user", user);
  // Find User
  const foundUser = await prisma.user.findUnique({
    where: { email: user.email },
  });
  if (!foundUser) {
    throw new ApiError(status.NOT_FOUND, "User not found");
  }
  console.log("foundUser", foundUser);
  // Prepare the review data
  const reviewData: Prisma.ReviewCreateInput = {
    user: { connect: { id: foundUser.id } },
    category: payload.category,
    title: payload.title,
    description: payload.description,
    imageUrl: payload.imageUrl,
    price: Number(payload.price),
    RatingSummary: Number(payload.RatingSummary),
  };

  // Create the review
  const review = await prisma.review.create({
    data: reviewData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          imageUrl: true,
        },
      },
      Comment: true,
    },
  });

  return review;
};

const getAllReviews = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          imageUrl: true,
        },
      },
      Comment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

const updateVotesInDB = async (id: string, voteTypes: string) => {
  if (!id || !voteTypes) throw new ApiError(status.BAD_REQUEST, "Bad Request");
  // Checking is review exists

  const isReviewExists = await prisma.review.findUnique({
    where: {
      id,
    },
  });

  if (!isReviewExists)
    throw new ApiError(status.NOT_FOUND, "Review Not Found.");
  const result = await prisma.review.update({
    where: {
      id,
    },
    data: {
      [voteTypes]: {
        increment: 1,
      },
    },
  });

  return result;
};

export const ReviewServices = {
  createReview,
  getAllReviews,
  updateVotesInDB,
};
