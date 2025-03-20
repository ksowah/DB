import { UserModel } from "../models";
import { runFindQuery, runCountQuery, runGetId } from '../utils'

export const getUsers = async (args) => {
  return runFindQuery("User", args);
};

export const getUsersCount = async (args) => {
  return runCountQuery("User", args);
};

export const getUserById = async (id: string) => {
  return runGetId("User", id);
};


export const updateUser = async (id: string, input: any) => {
  return await UserModel.findByIdAndUpdate(id, input, { new: true });
};

export const deleteUser = async (id: string) => {
  return await UserModel.findByIdAndDelete(id);
};