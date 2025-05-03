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
exports.PaymentServices = void 0;
const stripe_1 = __importDefault(require("stripe"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const config_1 = __importDefault(require("../../../config"));
const sendEmail_1 = __importDefault(require("../../../helpers/sendEmail"));
const client_1 = require("@prisma/client");
const stripe = new stripe_1.default(config_1.default.STRIPE_SECRET_KEY, {
    apiVersion: "2024-04-10; custom_checkout_beta=v1",
});
const createChechoutSession = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const createCustomer = yield stripe.customers.create({
        email: payload === null || payload === void 0 ? void 0 : payload.email,
        name: payload === null || payload === void 0 ? void 0 : payload.name,
    });
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: Number(payload.amount) * 100,
        currency: "bdt",
        payment_method_types: ["card"],
        customer: createCustomer.id,
    });
    return { clientSecret: paymentIntent.client_secret };
});
const createPaymentInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userInfo = yield prisma_1.default.user.findUnique({
        where: { email: payload.email },
    });
    if (!userInfo) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist");
    }
    const reviewInfo = yield prisma_1.default.review.findUnique({
        where: { id: payload === null || payload === void 0 ? void 0 : payload.reviewId },
    });
    if (!reviewInfo) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Review does not exist");
    }
    const paymentInfo = yield prisma_1.default.payment.create({
        data: {
            amount: 200,
            completedAt: new Date(),
            currency: "bdt",
            reviewId: reviewInfo.id,
            email: userInfo.email,
            userId: userInfo.id,
            transactionId: payload.transactionId,
            paymentStatus: client_1.PaymentStatus.CONFIRMED,
            paymentMethod: (_a = payload.paymentMethod) !== null && _a !== void 0 ? _a : "card"
        },
    });
    yield prisma_1.default.premiumPurchaseReview.create({
        data: {
            userId: userInfo.id,
            reviewId: reviewInfo.id,
            paymentId: paymentInfo.id
        },
    });
    const emailInfo = {
        name: userInfo.name,
        email: userInfo.email,
        subject: "Payment Confirmation",
        transactionId: paymentInfo.transactionId,
        reviewId: reviewInfo.id,
        amount: reviewInfo.price,
        completedAt: paymentInfo.completedAt
    };
    (0, sendEmail_1.default)(emailInfo);
    return paymentInfo;
});
const getPaymentsByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUnique({
        where: {
            email: email,
        },
    });
    if (!userInfo) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist");
    }
    const result = yield prisma_1.default.payment.findMany({
        where: {
            email: email,
        },
    });
    return result;
});
const getAllPaymentsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.payment.findMany({});
    return result;
});
exports.PaymentServices = {
    createChechoutSession,
    createPaymentInDB,
    getPaymentsByEmail,
    getAllPaymentsFromDB,
};
