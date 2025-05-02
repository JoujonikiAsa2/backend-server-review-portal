import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { findUserByEmail } from "../../../helpers/userHelpers";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import status from "http-status";

type TLogin = {
  email: string;
  password: string;
};

// new branch created
const prismaWithPassword = new PrismaClient();
const login = async (payload: TLogin) => {
  const { email, password } = payload;

  const isUserExists = await prismaWithPassword.user.findUnique({
    where: {
      email,
    },
  });
  console.log(isUserExists);

  if (!isUserExists) throw new ApiError(status.NOT_FOUND, "User Not Found.");

  const isPasswordValid = await bcrypt.compare(
    password,
    isUserExists?.password!
  );

  if (!isPasswordValid)
    throw new ApiError(status.UNAUTHORIZED, "Invalid Credentials.");
  const loggedInUser = {
    name: isUserExists.name,
    email: isUserExists.email,
    role: isUserExists.role,
  };
  console.log(loggedInUser);
  return loggedInUser;
};

export const AuthServices = {
  login,
};
