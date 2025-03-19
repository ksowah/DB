
import type { CodegenConfig } from '@graphql-codegen/cli';
import { typeDefs as scalarTypeDefs } from "graphql-scalars";

const config: CodegenConfig = {
  overwrite: true,
  schema: ["src/apollo",
    ...scalarTypeDefs
  ],
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers"]
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
