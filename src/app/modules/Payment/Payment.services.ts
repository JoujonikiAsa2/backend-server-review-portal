import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import status from "http-status";
import { TPayment } from "./Payment.ZodValidations";

const CreatePaymentInDB = async (payload: TPayment) => {
  // return result;
};

const GetAllPaymentsFromDB = async () => {
  const users = await prisma.payment.findMany({});
  return users;
};

export const PaymentServices = {
  CreatePaymentInDB,
  GetAllPaymentsFromDB,
};
