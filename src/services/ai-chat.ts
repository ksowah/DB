import config from "../config";
import { IAppContext } from "context";
import { ChatModel, MessageModel } from "../models";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: config.deepseek.key,
});

export async function streamChat(args, ctx: IAppContext) {
  try {
    let chat = await ChatModel.findById(args.chatId);

    if (!chat) {
      chat = await ChatModel.create({
        name: args.prompt,
        createdBy: ctx.user,
      });
    }

    const conversations = await MessageModel.find({
      user: ctx.user,
      chatId: chat._id,
    })
      .sort({ createdAt: -1 })
      .limit(2)
      .exec();

    const conversationMessages = conversations.reverse().flatMap((msg) => [
      { role: "user" as const, content: msg.prompt },
      { role: "assistant" as const, content: msg.message },
    ]);

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system" as const,
          content:
            "You are a database schema expert. Guide the user through creating a nosql schema. Ask one question at a time. When ready, output the schema in JSON format with this structure: { 'schema': { ... }, 'indexes': [...] }",
        },
        ...conversationMessages,
        { role: "user", content: args.prompt },
      ],
      model: "deepseek-chat",
      stream: true,
    });

    const newMessage = await MessageModel.create({
      user: ctx.user,
      chatId: chat._id,
      prompt: args.prompt,
      message: "", 
    })

    console.log("the completio >>>", completion)

    return { 
        stream: completion,
        message: newMessage,
        conversations,
      };
  } catch (err) {
    throw err;
  }
}
