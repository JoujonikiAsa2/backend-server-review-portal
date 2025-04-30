import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { findUserByEmail } from "../../../helpers/userHelpers";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import bcrypt from "bcrypt";
import { TUser } from "./User.ZodValidations";
import status from "http-status";

const registerUserIntoDB = async (payload: TUser) => {
  const { name, email, password } = payload;
  console.log("User payload ", payload);

  // Check if user already exists
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user) throw new ApiError(status.CONFLICT, "User Already Exists.");

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);
  const userData = {
    name,
    email,
    password: hashedPassword,
  };

  console.log("User Data: ", userData);
  // Create user in DB

  const result = await prisma.user.create({
    data: userData,
  });

  return result;
};

export const UserServices = {
  registerUserIntoDB,
};
