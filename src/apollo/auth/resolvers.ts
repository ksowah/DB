    import services from "../../services";

const authResolvers = {

  Mutation: {
    loginUser: (_, args, ctx) => {
      return services.auth.loginUser(args,  ctx);
    },
    registerUser: (_, args, ctx) => {
      return services.auth.registerUser(args.input, ctx);
    },
  },
};

export default authResolvers;