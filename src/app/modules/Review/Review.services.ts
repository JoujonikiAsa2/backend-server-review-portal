import { Prisma } from "@prisma/client";
import prisma from "../../shared/prisma";
import { CreateReviewInput, ReviewWithRelations } from "./Review.interface";

const createReview = async (
  user: { email: string },
  payload: CreateReviewInput
): Promise<ReviewWithRelations> => {
  // 1. Find the user based on their email
  const foundUser = await prisma.user.findUniqueOrThrow({
    where: { email: user.email },
  });

  // 2. Prepare the RatingSummary data (if it exists) otherwise set it to undefined
  const ratingData = payload.RatingSummary
    ? {
        create: {
          oneStar: payload.RatingSummary.oneStar,
          twoStars: payload.RatingSummary.twoStars,
          threeStars: payload.RatingSummary.threeStars,
          fourStars: payload.RatingSummary.fourStars,
        },
      }
    : undefined;

  // 3. Prepare the review data
  const reviewData: Prisma.ReviewCreateInput = {
    user: { connect: { id: foundUser.id } },
    category: payload.category,
    upVotes: payload.upVotes,
    downVotes: payload.downVotes,
    isPremium: payload.isPremium,
    RatingSummary: ratingData,
  };

  // 4. Create the review
  const review = await prisma.review.create({
    data: reviewData,
    include: {
      RatingSummary: true,
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

  // 5. Return the review
  return review;
};

const getAllReviews = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      // step1 Includes the rating summary for each review
      RatingSummary: true,
      user: {
        // step2 include all off these
        select: {
          id: true,
          name: true,
          email: true,
          imageUrl: true,
        },
      },
      // step3 Includes all comments related to each review
      Comment: true,
    },
    orderBy: {
      // step4 Orders reviews by the creation date (newest first)
      createdAt: "desc",
    },
  });
  // step5  Returns the list of reviews with related data
  return reviews;
};

export const ReviewServices = {
  createReview,
  getAllReviews,
};
