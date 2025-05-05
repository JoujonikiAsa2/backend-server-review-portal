import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PaymentServices } from "./Payment.services";

const createPayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.CreatePaymentInDB(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Payment Created Successfully.",
    data: result,
  });
});
const GetAllPayment = catchAsync(async (req, res) => {
  const result = await PaymentServices.GetAllPaymentsFromDB();

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Payment data fetched Successfully.",
    data: result,
  });
});

export const PayementControllers = {
  createPayment,
  GetAllPayment,
};
