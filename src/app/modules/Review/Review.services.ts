import { Prisma, Review } from "@prisma/client";
import prisma from "../../shared/prisma";
import { TReview } from "./Review.ZodValidations";
import ApiError from "../../errors/ApiError";
import status from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { paginationHelper } from "../../../helpers/paginationHelper";

const createReview = async (
  user: JwtPayload,
  payload: TReview & {isPremium : boolean}
): Promise<Review> => {
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
    isPremium: user?.userRole.toUpperCase() === "ADMIN" && payload.isPremium ? true : false,

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
  const { page, skip, limit } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterDataWithoutSearchTerm } = filterData;

  const andConditions: Prisma.ReviewWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      title: {
        contains: searchTerm,
        mode: "insensitive",
      },
    });
  }
  if (filterData.startDate || filterData.endDate) {
    console.log("Date range", filterData.startDate, filterData.endDate);
    const dateRange: any = {};

    if (filterData.startDate) {
      dateRange.gte = new Date(filterData.startDate);
    }

    if (filterData.endDate) {
      dateRange.lte = new Date(filterData.endDate);
    }

    andConditions.push({
      createdAt: dateRange,
    });

    delete filterDataWithoutSearchTerm.startDate;
    delete filterDataWithoutSearchTerm.endDate;
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
    skip: skip,
    take: limit,
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

  const reviewCount = await prisma.review.count();

  const filteredReviews = await prisma.review.count({
    where: {
      isPublished: true,
      AND: andConditions,
    },
  });

  return {
    meta: {
      totalPage: Math.ceil(reviewCount / limit),
      total: filteredReviews,
      limit,
      page,
    },
    data: reviews,
  };
};

// const getAllReviewByIdFromDB = async (id: string) => {
//   const reviews = await prisma.review.findUnique({
//     where: {
//       id,
//       isPublished: true,
//     },
//     include: {
//       user: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           imageUrl: true,
//         },
//       },
//     },
//   });

//   return reviews;
// };
const getAllReviewByIdFromDB = async (id: string, action?: string) => {
  let reviews;
  console.log("action type", action);
  if (action) {
    reviews = await prisma.review.findUnique({
      where: {
        id,
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
  } else {
    reviews = await prisma.review.findUnique({
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
  }
  // console.log("reviews", reviews);
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

const updateVotesInDB = async (user: any, id: string, voteTypes: string) => {
  if (!id || !voteTypes) throw new ApiError(status.BAD_REQUEST, "Bad Request");

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new ApiError(status.NOT_FOUND, "Review does not exist");

  const tokenUser = await prisma.user.findUnique({
    where: { email: user?.email },
  });
  if (!tokenUser) throw new ApiError(status.NOT_FOUND, "User does not exist");

  const existingVote = await prisma.vote.findUnique({
    where: {
      reviewId_userId: {
        userId: tokenUser.id,
        reviewId: id,
      },
    },
  });

  let upVotes = review.upVotes;
  let downVotes = review.downVotes;

  let voteData: { upVote: boolean; downVote: boolean } = {
    upVote: false,
    downVote: false,
  };

  if (voteTypes === "upVotes") {
    if (existingVote?.upVote) {
      upVotes--;
    } else if (existingVote?.upVote) {
      if (existingVote?.downVote) {
        downVotes--;
      }
      upVotes++;
      voteData.upVote = true;
    } else {
      if (existingVote?.downVote) {
        downVotes--;
      }
      upVotes++;
      voteData.upVote = true;
    }
  } else if (voteTypes === "downVotes") {
    if (existingVote?.downVote) {
      downVotes--;
    } else {
      if (existingVote?.upVote) {
        upVotes--;
      }
      downVotes++;
      voteData.downVote = true;
    }
  } else if (voteTypes === "removeVote") {
    if (existingVote?.upVote) {
      upVotes--;
    }
    if (existingVote?.downVote) {
      downVotes--;
    }
  }

  await prisma.$transaction([
    prisma.vote.upsert({
      where: {
        reviewId_userId: {
          userId: tokenUser.id,
          reviewId: id,
        },
      },
      update: voteData,
      create: {
        userId: tokenUser.id,
        reviewId: id,
        ...voteData,
      },
    }),
    prisma.review.update({
      where: { id },
      data: {
        upVotes,
        downVotes,
      },
    }),
  ]);

  return { success: true, upVotes, downVotes };
};

const getReviewCountFromDB = async () => {
  const reviews = await prisma.review.count({});
  return reviews;
};

const getMyReviewsromDB = async (user: JwtPayload) => {
  const { userRole, email } = user;
  console.log("get my reviews", user);
  if (userRole === "admin") {
    console.log("admin");
    return await prisma.review.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }
  const reviews = await prisma.review.findMany({
    where: {
      user: {
        email,
      },
    },
  });

  return reviews;
};

const updateReviewStatus = async (reviewId: string, actionType: string) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new ApiError(status.NOT_FOUND, "Review does not exist");
  if(actionType === "accept"){
    const result = await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        isPublished: true
      },
    });
    return result;
  }
  else{
    const result = await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        isPublished: false
      },
    });
    return result;
  }
};

const getUnpublishedReviews = async (user: JwtPayload) => {
  const reviews = await prisma.review.findMany({
    where: {
      isPublished: false,
    },
  });

  return reviews;
};


export const ReviewServices = {
  createReview,
  getAllReviews,
  updateVotesInDB,
  getAllReviewByIdFromDB,
  updateReviewInDB,
  deleteReviewInDB,
  getMyReviewsromDB,
  getReviewCountFromDB,
  updateReviewStatus,
  getUnpublishedReviews
};
