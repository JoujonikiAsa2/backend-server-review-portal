import Stripe from "stripe";
import status from "http-status";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { TPayment } from "./Payment.ZodValidations";
import config from "../../../config";
import sendMail from "../../../helpers/sendEmail";
import { PaymentStatus } from "@prisma/client";

const stripe = new Stripe(config.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10; custom_checkout_beta=v1" as any,
});

const createChechoutSession = async (payload: {
  name: string;
  email: string;
  amount: number;
}) => {
  const createCustomer = await stripe.customers.create({
    email: payload?.email,
    name: payload?.name,
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(payload.amount) * 100,
    currency: "bdt",
    payment_method_types: ["card"],
    customer: createCustomer.id,
  });
  return { clientSecret: paymentIntent.client_secret };
};

const createPaymentInDB = async (payload: TPayment) => {
  const userInfo = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!userInfo) {
    throw new ApiError(status.NOT_FOUND, "User does not exist");
  }

  const reviewInfo = await prisma.review.findUnique({
    where: { id: payload?.reviewId },
  });

  if (!reviewInfo) {
    throw new ApiError(status.NOT_FOUND, "Review does not exist");
  }

  const paymentInfo = await prisma.payment.create({
    data: {
      amount: reviewInfo.price || 0,
      completedAt: new Date(),
      currency: "bdt",
      reviewId: reviewInfo.id,
      email: userInfo.email,
      userId: userInfo.id,
      transactionId: payload.transactionId,
      paymentStatus: PaymentStatus.CONFIRMED,
      paymentMethod: payload.paymentMethod ?? "card",
    },
  });

  await prisma.premiumPurchaseReview.create({
    data: {
      userId: userInfo.id,
      reviewId: reviewInfo.id,
      paymentId: paymentInfo.id,
    },
  });

  const emailInfo = {
    name: userInfo.name,
    email: userInfo.email,
    subject: "Payment Confirmation",
    transactionId: paymentInfo.transactionId,
    reviewId: reviewInfo.id,
    amount: reviewInfo.price,
    completedAt: paymentInfo.completedAt,
  };

  sendMail(emailInfo);

  return paymentInfo;
};

const getPaymentsByEmail = async (email: string) => {
  const userInfo = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!userInfo) {
    throw new ApiError(status.NOT_FOUND, "User does not exist");
  }

  const result = await prisma.payment.findMany({
    where: {
      email: email,
    },
  });
  return result;
};

const getPaymentById = async (id: string) => {
  const result = await prisma.payment.findFirst({
    where: {
      id: id,
    },
  });
  return result;
};

const getAllPaymentsFromDB = async () => {
  const result = await prisma.payment.findMany({});
  return result;
};

const popularReviews = async () =>{
  const popularReviews = await prisma.review.findMany({
    where: {
      PremiumPurchaseReview: {
        some: {}, // only include reviews that have at least one purchase
      },
    },
    include: {
      PremiumPurchaseReview: {
        include: {
          payment: true,
        },
      },
    },
  });

  const result = popularReviews.map((review) => {
    const purchaseCount = review.PremiumPurchaseReview.length;
    const totalRevenue = review.PremiumPurchaseReview.reduce(
      (sum, purchase) => sum + (purchase.payment?.amount || 0),
      0
    );
  
    return {
      reviewId: review.id,
      title: review.title,       
      category: review.category,   
      price: review.price,
      purchaseCount,
      revenue: totalRevenue,
    };
  });
  
  result.sort((a, b) => b.purchaseCount - a.purchaseCount);
  const topReviews = result.slice(0, 10);
  
  const totalEarnings = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
  });

  return {topReviews,totalEarnings};
  
}

export const PaymentServices = {
  createChechoutSession,
  createPaymentInDB,
  getPaymentsByEmail,
  getPaymentById,
  getAllPaymentsFromDB,
  popularReviews
};
