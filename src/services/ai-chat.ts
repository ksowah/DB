import config from "../config";
import { IAppContext } from "context";
import { ChatModel, MessageModel } from "../models";

export async function streamChat(args, ctx: IAppContext) {
  try {
    let chat = await ChatModel.findById(args.chatId);
    if (!chat) {
      chat = await ChatModel.create({
        name: "New Chat",
        createdBy: ctx.user,
      });
    }

    const messages = await MessageModel.find({
      user: ctx.user,
      chatId: chat._id,
    })
      .sort({ createdAt: -1 })
      .limit(2)
      .exec();

    // Format messages for Mistral instruction template
    let prompt = `<s>[INST] You are a database schema expert. Guide the user through creating a NoSQL schema. Ask one question at a time. When ready, output the schema in JSON format with this structure: { "schema": { ... }, "indexes": [...] } [/INST]</s>`;
    
    messages.reverse().forEach(msg => {
      prompt += msg.prompt
        ? ` [INST] ${msg.prompt} [/INST] `
        : ` ${msg.message} </s>`;
    });

    prompt += ` [INST] ${args.prompt} [/INST] `;

    // Call Hugging Face API without streaming
    const response = await fetch(
      `https://api-inference.huggingface.com/models/${config.huggingface.model}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.huggingface.key}`,
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 1000,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${await response.text()}`);
    }

    const responseData = await response.json();
    const generatedText = responseData[0]?.generated_text || "";

    const newMessage = await MessageModel.create({
      user: ctx.user,
      chatId: chat._id,
      prompt: args.prompt,
      message: generatedText,
    });

    return {
      messageId: newMessage._id,
      response: generatedText,
    };
  } catch (err) {
    throw new Error(`Error processing chat request: ${err.message}`);
  }
}