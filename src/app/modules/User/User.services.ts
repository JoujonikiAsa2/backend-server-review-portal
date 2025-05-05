import bcrypt from "bcrypt";
import status from "http-status";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { TUpdateUser, TUser } from "./User.ZodValidations";

const registerUserIntoDB = async (payload: TUser) => {
  const { name, email, password } = payload;
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

  // Create user in DB
  const result = await prisma.user.create({
    data: userData,
  });

  return result;
};

const updateUserInDB = async (user: JwtPayload, payload: TUpdateUser) => {
  const users = await prisma.user.update({
    where: {
      email: user.email,
    },
    data: payload,
  });
  const updatedUser = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });
  return updatedUser;
};
const GetAllUsersFromDB = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      imageUrl: true,
      createdAt: true,
    },
  });
  return users;
};

export const UserServices = {
  registerUserIntoDB,
  GetAllUsersFromDB,
  updateUserInDB,
};
