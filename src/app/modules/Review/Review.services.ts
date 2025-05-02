import { Prisma } from "@prisma/client";
import prisma from "../../shared/prisma";
import { CreateReviewInput, ReviewWithRelations } from "./Review.interface";
import { TReview } from "./Review.ZodValidations";

const createReview = async (user: { email: string }, payload: TReview) => {
  console.log("payload", payload);
  console.log("user", user);
  // Find User
  const foundUser = await prisma.user.findUniqueOrThrow({
    where: { email: user.email },
  });
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

export const ReviewServices = {
  createReview,
  getAllReviews,
};
