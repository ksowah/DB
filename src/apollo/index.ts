import { makeExecutableSchema } from "@graphql-tools/schema";
import { readFileSync } from "fs";
import { typeDefs as scalarTypeDefs } from "graphql-scalars";
import { gql } from "graphql-tag";
import merge from "lodash/merge";
import { join } from "path";
import { globSync } from "glob";



const schemaFilPaths = globSync(join(__dirname, "**/schema.graphql"));
const schemaFiles = schemaFilPaths.map((path) => readFileSync(path, { encoding: "utf-8" }));
export const typeDefs = gql(
    [
        ...schemaFiles,
        scalarTypeDefs,
    ].join("\n"),
);

const resolverPaths = globSync(join(__dirname, "**/resolvers.js"));
console.log(resolverPaths);
export const resolvers = merge(resolverPaths.map((path) => require(path).default));



export const schema =
    makeExecutableSchema({
        typeDefs,
        resolvers,
    })
