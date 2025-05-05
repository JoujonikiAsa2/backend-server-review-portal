import prisma from "../../shared/prisma";
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
