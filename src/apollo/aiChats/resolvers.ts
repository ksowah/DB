import services from "../../services";

const aiChatResolvers = {
  Mutation: {
    streamChat: (_, args, ctx) => {
      return services.aiChat.streamChat(args,  ctx);
    },
  },
};

export default aiChatResolvers;