import services from "../../services";

const chatResolvers = {
  Query: {
    getChats: (_, args, ctx) => {
      return services.chats.getChats(args, ctx);
    },
    getChat: (_, args) => {
      return services.chats.getChatById(args.id);
    },
    getChatsCount: (_, args) => {
      return services.chats.getChatsCount(args);
    },
  },
  Mutation: {
    updateChat: (_, args) => {
      return services.chats.updateChat(args.id, args.input);
    },
  },
};

export default chatResolvers;