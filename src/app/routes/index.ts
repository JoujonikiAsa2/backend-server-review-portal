import express from "express";
// import { AuthRoutes } from "../modules/Auth/Auth.routes";
import { UserRoutes } from "../modules/User/User.routes";
import { PaymentRoutes } from "../modules/Payment/Payment.routes";
import { ReviewRoutes } from "../modules/Review/Review.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
