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
exports.PayementControllers = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const Payment_services_1 = require("./Payment.services");
const createCheckoutSession = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Payment_services_1.PaymentServices.createChechoutSession(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Checkout Session Created Successfully.",
        data: result,
    });
}));
const createPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Payment_services_1.PaymentServices.createPaymentInDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Payment Created Successfully.",
        data: result,
    });
}));
const getMyPayments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Payment_services_1.PaymentServices.getPaymentsByEmail(req.params.email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payments Fetched Successfully.",
        data: result,
    });
}));
const getAllPayments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Payment_services_1.PaymentServices.getAllPaymentsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payments Fetched Successfully.",
        data: result,
    });
}));
exports.PayementControllers = {
    createCheckoutSession,
    createPayment,
    getMyPayments,
    getAllPayments,
};
