import { IAppContext } from "context";
import { ProjectModel } from "../models";
import { generateCode, runCountQuery, runFindQuery, runGetId } from "../utils";

export async function createProject(args, ctx: IAppContext) {
  try {
    const newProject = await ProjectModel.create({
      ...args,
      code: await generateCode("Project"),
      createdBy: ctx.user,
    });
    return newProject;
  } catch (err) {
    throw err;
  }
}

export async function updateProject(args, ctx: IAppContext) {
  try {
    const { id, ...updates } = args;
    const existingProject = await ProjectModel.findById(id);
    if (!existingProject) throw new Error("Project not found");

    existingProject.$set({
      ...updates,
    });
    await existingProject.save();
    return existingProject;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export const getProjects = async (args, ctx: IAppContext) => {
  const projects = runFindQuery("Project", {
    filter: {
      createdBy: ctx.user,
    },
    ...args,
  });
  
  return projects;
};

export const getProjectsCount = async (args) => {
  return runCountQuery("Project", args);
};

export const getProjectById = async (id: string) => {
  return runGetId("Project", id);
};
