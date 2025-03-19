import services from "../../services";

const resolvers = {
  Query: {
    getUsers: (_, args) => {
      return services.users.getUsers(args);
    },
    getUser: (_, args) => {
      return services.users.getUserById(args.id);
    },
    getUsersCount: (_, args) => {
      return services.users.getUsersCount(args);
    },
  },
  Mutation: {
    updateUser: (_, args) => {
      return services.users.updateUser(args.id, args.input);
    },
    deleteUser: (_, args) => {
      return services.users.deleteUser(args.id);
    },
  },
};

export default resolvers;