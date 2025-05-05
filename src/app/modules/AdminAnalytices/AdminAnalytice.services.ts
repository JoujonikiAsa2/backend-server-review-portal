import prisma from "../../shared/prisma";

export const fetchAnalytics = async () => {
  const totalEarnings = await prisma.payment.aggregate({
    _sum: { amount: true },
  });

  // Premium Reviews Count
  const premiumReviewCount = await prisma.review.count({
    where: { isPremium: true },
  });

  // Reviews by Category
  const reviewsByCategory = await prisma.review.groupBy({
    by: ["category"],
    _count: {
      _all: true,
    },
  });

  // Review Approval Status (Approved / Pending or any other status you might have)
  const reviewStatus = await prisma.review.groupBy({
    by: ["isPremium"],
    _count: {
      _all: true,
    },
  });

  // Fetch all reviews with their respective data (user, category, rating summary)
  const allReviews = await prisma.review.findMany({
    include: {
      user: true,
      RatingSummary: true,
    },
  });

  const reviewPublishStatus = await prisma.review.groupBy({
    by: ["isPremium"],
    _count: {
      _all: true,
    },
  });

  return {
    totalEarnings: totalEarnings._sum.amount || 0,
    premiumReviewCount,
    reviewsByCategory,
    reviewStatus,
    allReviews,
    reviewPublishStatus,
  };
};

export const fetchAllReviews = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      user: true,
      RatingSummary: true,
    },
  });
  return reviews;
};

export const AdminAnalyticsService = {
  fetchAnalytics,
  fetchAllReviews,
};
