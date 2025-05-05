"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAnalyticsService = exports.fetchAllReviews = exports.fetchAnalytics = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const fetchAnalytics = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalEarnings = yield prisma_1.default.payment.aggregate({
        _sum: { amount: true },
    });
    // Premium Reviews Count
    const premiumReviewCount = yield prisma_1.default.review.count({
        where: { isPremium: true },
    });
    // Reviews by Category
    const reviewsByCategory = yield prisma_1.default.review.groupBy({
        by: ["category"],
        _count: {
            _all: true,
        },
    });
    // Review Approval Status (Approved / Pending or any other status you might have)
    const reviewStatus = yield prisma_1.default.review.groupBy({
        by: ["isPremium"],
        _count: {
            _all: true,
        },
    });
    // Fetch all reviews with their respective data (user, category, rating summary)
    const allReviews = yield prisma_1.default.review.findMany({
        include: {
            user: true,
            // RatingSummary: true, // Removed as it is not a valid property
        },
    });
    const reviewPublishStatus = yield prisma_1.default.review.groupBy({
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
});
exports.fetchAnalytics = fetchAnalytics;
const fetchAllReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield prisma_1.default.review.findMany({
        include: {
            user: true,
            // RatingSummary: true,
        },
    });
    return reviews;
});
exports.fetchAllReviews = fetchAllReviews;
exports.AdminAnalyticsService = {
    fetchAnalytics: exports.fetchAnalytics,
    fetchAllReviews: exports.fetchAllReviews,
};
