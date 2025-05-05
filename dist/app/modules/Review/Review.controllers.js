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
exports.ReviewControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const Review_services_1 = require("./Review.services");
const pick_1 = require("../../../helpers/pick");
const createReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //req.user exists
    const result = yield Review_services_1.ReviewServices.createReview(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Review Created Successfully.",
        data: result,
    });
}));
const GetAllReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filterData = (0, pick_1.pick)(req.query, [
        "searchTerm",
        "title",
        "category",
        "RatingSummary",
        "startDate",
        "endDate"
    ]);
    const options = (0, pick_1.pick)(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const result = yield Review_services_1.ReviewServices.getAllReviews(filterData, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Reviews fetched Successfully.",
        meta: result.meta,
        data: result.data,
    });
}));
const GetReviewById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Review_services_1.ReviewServices.getAllReviewByIdFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Reviews fetched Successfully.",
        data: result,
    });
}));
// Update review
const updateReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Review_services_1.ReviewServices.updateReviewInDB(req.user, req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Review updated Successfully.",
        data: result,
    });
}));
// Delete review
const deleteReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Review_services_1.ReviewServices.deleteReviewInDB(req.params.id, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Review deleted Successfully.",
        data: null,
    });
}));
const updateVotes = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield Review_services_1.ReviewServices.updateVotesInDB(req.params.id, (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.voteType, Number(req.query.count));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Vote updated Successfully.",
        data: result,
    });
}));
exports.ReviewControllers = {
    createReview,
    GetAllReview,
    updateVotes,
    GetReviewById,
    updateReview,
    deleteReview,
};
