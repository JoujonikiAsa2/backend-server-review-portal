import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PaymentServices } from "./Payment.services";

const createCheckoutSession = catchAsync(async (req, res) => {
  const result = await PaymentServices.createChechoutSession(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Checkout Session Created Successfully.",
    data: result,
  });
});

const createPayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.createPaymentInDB(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Payment Created Successfully.",
    data: result,
  });
});

const getMyPayments = catchAsync(async (req, res) => {
  const result = await PaymentServices.getPaymentsByEmail(req.params.email);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Payments Fetched Successfully.",
    data: result,
  });
});

const getPaymentById = catchAsync(async (req, res) => {
  const result = await PaymentServices.getPaymentById(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Payment Fetched Successfully.",
    data: result,
  });
});

const getAllPayments = catchAsync(async (req, res) => {
  const result = await PaymentServices.getAllPaymentsFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Payments Fetched Successfully.",
    data: result,
  });
});

const popularReviews = catchAsync(async (req, res) => {
  const result = await PaymentServices.popularReviews();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Popular Review Fetched Successfully.",
    data: result,
  });
});

export const PayementControllers = {
  createCheckoutSession,
  createPayment,
  getMyPayments,
  getPaymentById,
  getAllPayments,
  popularReviews
};
