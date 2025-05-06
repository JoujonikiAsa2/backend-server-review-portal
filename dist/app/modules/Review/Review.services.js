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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewServices = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createReview = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Find User
    const foundUser = yield prisma_1.default.user.findUnique({
        where: { email: user.email },
    });
    if (!foundUser) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // console.log("foundUser", foundUser);
    // Prepare the review data
    const reviewData = {
        user: { connect: { id: foundUser.id } },
        category: payload.category,
        title: payload.title,
        description: payload.description || "",
        imageUrl: payload.imageUrl || "",
        RatingSummary: Number(payload.RatingSummary),
        isPublished: (user === null || user === void 0 ? void 0 : user.userRole.toUpperCase()) === "ADMIN" ? true : false,
        isPremium: (user === null || user === void 0 ? void 0 : user.userRole.toUpperCase()) === "ADMIN" ? true : false,
        price: (user === null || user === void 0 ? void 0 : user.userRole.toUpperCase()) === "ADMIN" ? Number(payload.price) : 0,
    };
    // Create the review
    const review = yield prisma_1.default.review.create({
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
});
const getAllReviews = (filterData, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, skip, limit } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = filterData, filterDataWithoutSearchTerm = __rest(filterData, ["searchTerm"]);
    const andConditions = [];
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
        const dateRange = {};
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
    if (Object.keys(filterDataWithoutSearchTerm) &&
        Object.keys(filterDataWithoutSearchTerm).length > 0) {
        andConditions.push({
            AND: Object.keys(filterDataWithoutSearchTerm).map((key) => ({
                [key]: {
                    equals: key === "RatingSummary"
                        ? Number(filterDataWithoutSearchTerm[key])
                        : filterDataWithoutSearchTerm[key],
                },
            })),
        });
    }
    console.dir(andConditions, { depth: "infinity" });
    const reviews = yield prisma_1.default.review.findMany({
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
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
    });
    const reviewCount = yield prisma_1.default.review.count();
    const filteredReviews = yield prisma_1.default.review.count({
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
});
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
const getAllReviewByIdFromDB = (id, action) => __awaiter(void 0, void 0, void 0, function* () {
    let reviews;
    console.log("action type", action);
    if (action) {
        reviews = yield prisma_1.default.review.findUnique({
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
    }
    else {
        reviews = yield prisma_1.default.review.findUnique({
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
});
const updateReviewInDB = (user, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({
        user,
        id,
        payload,
    });
    // Check is review creator exists
    const isReviewCreatorExists = yield prisma_1.default.user.findUnique({
        where: {
            email: user.email,
        },
    });
    console.log("passed 1");
    if (!isReviewCreatorExists)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review Creator Not Found.");
    // Check is review exists
    const isReviewExists = yield prisma_1.default.review.findUnique({
        where: {
            id,
            userId: isReviewCreatorExists.id,
        },
    });
    console.log("passed 2");
    if (!isReviewExists)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review Not Found.");
    const result = yield prisma_1.default.review.update({
        where: {
            id,
            userId: isReviewCreatorExists.id,
        },
        data: payload,
    });
    return result;
});
const deleteReviewInDB = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("user", user);
    const isUserExists = yield prisma_1.default.user.findUnique({
        where: {
            email: user.email,
        },
    });
    console.log("user exists", isUserExists);
    if (!isUserExists)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found.");
    const isReviewBelongsToCurrentUser = yield prisma_1.default.review.findUnique({
        where: {
            id,
            userId: user.id,
        },
    });
    if (!isReviewBelongsToCurrentUser)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review Not Found.");
    const result = yield prisma_1.default.$transaction((tsClient) => __awaiter(void 0, void 0, void 0, function* () {
        // Delete all comments associated with this review
        yield tsClient.comment.deleteMany({
            where: {
                reviewId: id,
            },
        });
        // Delete review
        return yield tsClient.review.delete({
            where: {
                id,
                userId: isUserExists.id,
            },
        });
    }));
    return result;
});
const updateVotesInDB = (user, id, voteTypes) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id || !voteTypes)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Bad Request");
    const review = yield prisma_1.default.review.findUnique({ where: { id } });
    if (!review)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review does not exist");
    const tokenUser = yield prisma_1.default.user.findUnique({
        where: { email: user === null || user === void 0 ? void 0 : user.email },
    });
    if (!tokenUser)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist");
    const existingVote = yield prisma_1.default.vote.findUnique({
        where: {
            reviewId_userId: {
                userId: tokenUser.id,
                reviewId: id,
            },
        },
    });
    let upVotes = review.upVotes;
    let downVotes = review.downVotes;
    let voteData = {
        upVote: false,
        downVote: false,
    };
    if (voteTypes === "upVotes") {
        if (existingVote === null || existingVote === void 0 ? void 0 : existingVote.upVote) {
            upVotes--;
        }
        else if (existingVote === null || existingVote === void 0 ? void 0 : existingVote.upVote) {
            if (existingVote === null || existingVote === void 0 ? void 0 : existingVote.downVote) {
                downVotes--;
            }
            upVotes++;
            voteData.upVote = true;
        }
        else {
            if (existingVote === null || existingVote === void 0 ? void 0 : existingVote.downVote) {
                downVotes--;
            }
            upVotes++;
            voteData.upVote = true;
        }
    }
    else if (voteTypes === "downVotes") {
        if (existingVote === null || existingVote === void 0 ? void 0 : existingVote.downVote) {
            downVotes--;
        }
        else {
            if (existingVote === null || existingVote === void 0 ? void 0 : existingVote.upVote) {
                upVotes--;
            }
            downVotes++;
            voteData.downVote = true;
        }
    }
    else if (voteTypes === "removeVote") {
        if (existingVote === null || existingVote === void 0 ? void 0 : existingVote.upVote) {
            upVotes--;
        }
        if (existingVote === null || existingVote === void 0 ? void 0 : existingVote.downVote) {
            downVotes--;
        }
    }
    yield prisma_1.default.$transaction([
        prisma_1.default.vote.upsert({
            where: {
                reviewId_userId: {
                    userId: tokenUser.id,
                    reviewId: id,
                },
            },
            update: voteData,
            create: Object.assign({ userId: tokenUser.id, reviewId: id }, voteData),
        }),
        prisma_1.default.review.update({
            where: { id },
            data: {
                upVotes,
                downVotes,
            },
        }),
    ]);
    return { success: true, upVotes, downVotes };
});
const getReviewCountFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield prisma_1.default.review.count({});
    return reviews;
});
const getMyReviewsromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { userRole, email } = user;
    console.log("get my reviews", user);
    if (userRole === "admin") {
        console.log("admin");
        return yield prisma_1.default.review.findMany({
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
    const reviews = yield prisma_1.default.review.findMany({
        where: {
            user: {
                email,
            },
        },
    });
    return reviews;
});
const updateReviewStatus = (reviewId, actionType) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield prisma_1.default.review.findUnique({ where: { id: reviewId } });
    if (!review)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review does not exist");
    if (actionType === "accept") {
        const result = yield prisma_1.default.review.update({
            where: {
                id: reviewId,
            },
            data: {
                isPublished: true
            },
        });
        return result;
    }
    else {
        const result = yield prisma_1.default.review.update({
            where: {
                id: reviewId,
            },
            data: {
                isPublished: false
            },
        });
        return result;
    }
});
exports.ReviewServices = {
    createReview,
    getAllReviews,
    updateVotesInDB,
    getAllReviewByIdFromDB,
    updateReviewInDB,
    deleteReviewInDB,
    getMyReviewsromDB,
    getReviewCountFromDB,
    updateReviewStatus,
};
