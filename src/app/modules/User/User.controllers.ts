import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { UserServices } from "./User.services";

const registerUser = catchAsync(async (req, res) => {
  const result = await UserServices.registerUserIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "User Created Successfully.",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const result = await UserServices.updateUserInDB(req.user, req.body);

  sendResponse(res, {
    statusCode: status.OK, 
    success: true,
    message: "User Updated Successfully.",
    data: result,
  });
});
const GetAllUsers = catchAsync(async (req, res) => {
  const result = await UserServices.GetAllUsersFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Users Fetched successfully.",
    data: result,
  });
});

export const UserControllers = {
  registerUser,
  GetAllUsers,
  updateUser,
};
