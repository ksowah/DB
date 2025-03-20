import services from "../../services";

const projectResolvers = {
  Query: {
    getProjects: (_, args, ctx) => {
      return services.projects.getProjects(args, ctx);
    },
    getProject: (_, args) => {
      return services.projects.getProjectById(args.id);
    },
    getProjectsCount: (_, args) => {
      return services.projects.getProjectsCount(args);
    },
  },
  Mutation: {
    updateProject: (_, args) => {
      return services.projects.updateProject(args.id, args.input);
    },
    createProject: (_, args, ctx) => {
      return services.projects.createProject(args, ctx);
    },
  },
};

export default projectResolvers;