import { Prisma, Review } from "@prisma/client";
import prisma from "../../shared/prisma";
import { TReview, TReviewUpdate } from "./Review.ZodValidations";
import ApiError from "../../errors/ApiError";
import status from "http-status";
import { JwtPayload } from "jsonwebtoken";

const createReview = async (
  user: JwtPayload,
  payload: TReview 
): Promise<Review> => {
  // Find User
  const foundUser = await prisma.user.findUnique({
    where: { email: user.email },
  });
  if (!foundUser) {
    throw new ApiError(status.NOT_FOUND, "User not found");
  }
  // console.log("foundUser", foundUser);
  // Prepare the review data
  const reviewData: Prisma.ReviewCreateInput = {
    user: { connect: { id: foundUser.id } },
    category: payload.category,
    title: payload.title,
    description: payload.description || "",
    imageUrl: payload.imageUrl || "",
    RatingSummary: Number(payload.RatingSummary),
    isPublished: user?.userRole.toUpperCase() === "ADMIN" ? true : false,
    isPremium: user?.userRole.toUpperCase() === "ADMIN" ? true : false,
    price: user?.userRole.toUpperCase() === "ADMIN" ? Number(payload.price) : 0,
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

const getAllReviews = async (filterData: any, options: any) => {
  const { searchTerm, ...filterDataWithoutSearchTerm } = filterData;
  console.log(options);
  const andConditions: Prisma.ReviewWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      title: {
        contains: searchTerm,
        mode: "insensitive",
      },
    });
  }
  if (
    Object.keys(filterDataWithoutSearchTerm) &&
    Object.keys(filterDataWithoutSearchTerm).length > 0
  ) {
    andConditions.push({
      AND: Object.keys(filterDataWithoutSearchTerm).map((key) => ({
        [key]: {
          equals:
            key === "RatingSummary"
              ? Number(filterDataWithoutSearchTerm[key])
              : filterDataWithoutSearchTerm[key],
        },
      })),
    });
  }
  console.dir(andConditions, { depth: "infinity" });
  const reviews = await prisma.review.findMany({
    where: {
      isPublished: true,
      AND: andConditions,
    },
    skip: Number(options.page - 1) || 0,
    take: Number(options.limit) || 10,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          imageUrl: true,
        },
      },
    },
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  return reviews;
};
const getAllReviewByIdFromDB = async (id: string) => {
  const reviews = await prisma.review.findUnique({
    where: {
      id,
      isPublished: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          imageUrl: true,
        },
      },
    },
  });

  return reviews;
};

const updateReviewInDB = async (
  user: JwtPayload,
  id: string,
  payload: TReview
) => {
  console.log({
    user,
    id,
    payload,
  });

  // Check is review creator exists
  const isReviewCreatorExists = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });

  console.log("passed 1");
  if (!isReviewCreatorExists)
    throw new ApiError(status.NOT_FOUND, "Review Creator Not Found.");
  // Check is review exists
  const isReviewExists = await prisma.review.findUnique({
    where: {
      id,
      userId: isReviewCreatorExists.id,
    },
  });
  console.log("passed 2");

  if (!isReviewExists)
    throw new ApiError(status.NOT_FOUND, "Review Not Found.");
  const result = await prisma.review.update({
    where: {
      id,
      userId: isReviewCreatorExists.id,
    },
    data: payload,
  });
  return result;
};

const deleteReviewInDB = async (id: string, user: JwtPayload) => {
  console.log("user", user);
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });
  console.log("user exists", isUserExists);
  if (!isUserExists) throw new ApiError(status.NOT_FOUND, "User Not Found.");
  const isReviewBelongsToCurrentUser = await prisma.review.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!isReviewBelongsToCurrentUser)
    throw new ApiError(status.NOT_FOUND, "Review Not Found.");

  const result = await prisma.$transaction(async (tsClient) => {
    // Delete all comments associated with this review
    await tsClient.comment.deleteMany({
      where: {
        reviewId: id,
      },
    });

    // Delete review
    return await tsClient.review.delete({
      where: {
        id,
        userId: isUserExists.id,
      },
    });
  });

  return result;
};

const updateVotesInDB = async (
  id: string,
  voteTypes: string,
  count: number
) => {
  console.log({
    id,
    voteTypes,
    count,
  });
  if (!id || !voteTypes) throw new ApiError(status.BAD_REQUEST, "Bad Request");

  // Checking is review exists
  const isReviewExists = await prisma.review.findUnique({
    where: {
      id,
    },
  });
  console.log("isReviewExists", isReviewExists);
  const currentVotes = await prisma.review.findUnique({
    where: {
      id,
    },
    select: {
      upVotes: true,
      downVotes: true,
    },
  });
  if (
    (currentVotes?.upVotes === 0 && count < 0) ||
    (currentVotes?.downVotes === 0 && count < 0)
  )
    throw new ApiError(status.BAD_REQUEST, "Bad Request");
  if (!isReviewExists)
    throw new ApiError(status.NOT_FOUND, "Review Not Found.");
  const result = await prisma.review.update({
    where: {
      id,
    },
    data: {
      [voteTypes]: {
        increment: count,
      },
    },
    select: {
      upVotes: true,
      downVotes: true,
    },
  });
  // const result = await prisma.$transaction(async (tsClient) => {

  //   const updatedVoteForParticullarUser = await prisma.vote.upsert({
  //     where: {
  //       reviewId_userId: {
  //         reviewId: id,
  //         userId: isReviewExists.userId,
  //       },
  //     },
  //     update: voteTypes === "upVote" ? { upVote: true } : { downVote: true },
  //     create: {
  //       reviewId: id,
  //       userId: isReviewExists.userId,
  //       upVote: voteTypes === "upVote" ? true : false,
  //       downVote: voteTypes === "downVote" ? true : false,
  //     },
  //   });
  // });

  return result;
};

export const ReviewServices = {
  createReview,
  getAllReviews,
  updateVotesInDB,
  getAllReviewByIdFromDB,
  updateReviewInDB,
  deleteReviewInDB,
};