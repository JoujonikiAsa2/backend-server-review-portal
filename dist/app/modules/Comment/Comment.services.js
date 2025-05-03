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
exports.CommentServices = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const http_status_1 = __importDefault(require("http-status"));
const PostCommentInDB = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("user", user);
    console.log("comment payload", payload);
    // Find User
    const isUserExists = yield prisma_1.default.user.findUnique({
        where: {
            email: user.email,
        },
    });
    if (!isUserExists)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found.");
    // Check is review exists
    const isReviewExists = yield prisma_1.default.review.findUnique({
        where: {
            id: payload.reviewId,
        },
    });
    if (!isReviewExists)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review Not Found.");
    const result = yield prisma_1.default.comment.create({
        data: {
            userId: isUserExists.id,
            reviewId: payload.reviewId,
            content: payload.content,
        },
    });
    return result;
});
const GetAllCommentFromDbByReviewId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield prisma_1.default.comment.findMany({
        where: {
            reviewId: id,
        },
        include: {
            user: {
                select: {
                    name: true,
                    imageUrl: true,
                },
            },
        },
    });
    return comments;
});
const UpdateCommentOfReview = (user, id, content) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the comment user is exists
    const isUserExists = yield prisma_1.default.user.findUnique({
        where: {
            email: user.email,
        },
    });
    if (!isUserExists)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found.");
    // Find comment
    const comment = yield prisma_1.default.comment.findUnique({
        where: {
            userId: isUserExists.id,
            id,
        },
    });
    if (!comment)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Comment Not Found.");
    const comments = yield prisma_1.default.comment.update({
        where: {
            id,
        },
        data: {
            content,
        },
    });
    return comments;
});
// Delete comment of review
const DeleteCommentOfReview = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    console.log("user", user);
    // Check if the comment user is exists
    const isUserExists = yield prisma_1.default.user.findUnique({
        where: {
            email: user.email,
        },
    });
    if (!isUserExists)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Not Found.");
    if ((user === null || user === void 0 ? void 0 : user.userRole.toUpperCase()) === "ADMIN") {
        const comment = yield prisma_1.default.comment.findUnique({
            where: {
                id,
            },
        });
        if (!comment)
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Comment Not Found.");
        result = yield prisma_1.default.comment.delete({
            where: {
                id,
            },
        });
    }
    else {
        const comment = yield prisma_1.default.comment.findUnique({
            where: {
                userId: isUserExists.id,
                id,
            },
        });
        if (!comment)
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Comment Not Found.");
        result = yield prisma_1.default.comment.delete({
            where: {
                id,
            },
        });
    }
    return result;
});
exports.CommentServices = {
    PostCommentInDB,
    GetAllCommentFromDbByReviewId,
    UpdateCommentOfReview,
    DeleteCommentOfReview,
};
