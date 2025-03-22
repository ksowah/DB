import { IAppContext } from "context";
import { ChatModel } from "../models";
import { runCountQuery, runFindQuery, runGetId } from "../utils";


export async function updateChat(args, ctx: IAppContext) {
  try {
    const { id, ...updates } = args;
    const existingChat = await ChatModel.findById(id);
    if (!existingChat) throw new Error("Chat not found");

    existingChat.$set({
      ...updates,
    });
    await existingChat.save();
    return existingChat;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export const getChats = async (args, ctx: IAppContext) => {
  const Chats = runFindQuery("Chat", {
    filter: {
      createdBy: ctx.user,
    },
    ...args,
  });
  
  return Chats;
};

export const getChatsCount = async (args) => {
  return runCountQuery("Chat", args);
};

export const getChatById = async (id: string) => {
  return runGetId("Chat", id);
};
