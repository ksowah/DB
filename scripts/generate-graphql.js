const fs = require('fs');
const path = require('path');

// Get the resource name from the command line argument
const resourceName = process.argv[2];

if (!resourceName) {
  console.error('Please provide a resource name. Example: yarn resource users');
  process.exit(1);
}

// Helper function to capitalize the first letter of a string
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Helper function to convert to singular form (basic implementation)
const singularize = (str) => {
  if (str.endsWith('s')) {
    return str.slice(0, -1);
  }
  return str;
};

// Define paths
const resourceFolder = path.join(__dirname, '..', 'src', 'apollo', resourceName);
const schemaFile = path.join(resourceFolder, 'schema.graphql');
const resolversFile = path.join(resourceFolder, 'resolvers.ts');

// Create the resource folder
if (!fs.existsSync(resourceFolder)) {
  fs.mkdirSync(resourceFolder, { recursive: true });
}

// Generate the schema.graphql content
const schemaContent = `
type ${capitalize(singularize(resourceName))} {
  id: ID!
}

input Create${capitalize(singularize(resourceName))}Input {
  # Add fields as needed
}

input Update${capitalize(singularize(resourceName))}Input {
  # Add fields as needed
}

type Query {
  get${capitalize(resourceName)}: [${capitalize(singularize(resourceName))}]
  get${capitalize(singularize(resourceName))}(id: ID!): ${capitalize(singularize(resourceName))}
  get${capitalize(resourceName)}Count: Int
}

type Mutation {
  create${capitalize(singularize(resourceName))}(input: Create${capitalize(singularize(resourceName))}Input!): ${capitalize(singularize(resourceName))}
  update${capitalize(singularize(resourceName))}(id: ID!, input: Update${capitalize(singularize(resourceName))}Input!): ${capitalize(singularize(resourceName))}
  delete${capitalize(singularize(resourceName))}(id: ID!): Boolean
}
`;

// Generate the resolvers.ts content
const resolversContent = `
const resolvers = {
  Query: {
    get${capitalize(resourceName)}: () => {
      // Implement logic to fetch all ${resourceName}
      return [];
    },
    get${capitalize(singularize(resourceName))}: (parent, args) => {
      // Implement logic to fetch a single ${singularize(resourceName)} by ID
      return null;
    },
    get${capitalize(resourceName)}Count: () => {
      // Implement logic to count ${resourceName}
      return null;
    },
  },
  Mutation: {
    create${capitalize(singularize(resourceName))}: (parent, args) => {
      // Implement logic to create a ${singularize(resourceName)}
      return null;
    },
    update${capitalize(singularize(resourceName))}: (parent, args) => {
      // Implement logic to update a ${singularize(resourceName)}
      return null;
    },
    delete${capitalize(singularize(resourceName))}: (parent, args) => {
      // Implement logic to delete a ${singularize(resourceName)}
      return true;
    },
  },
};

export default resolvers;
`;

// Write the schema.graphql file
fs.writeFileSync(schemaFile, schemaContent.trim());

// Write the resolvers.ts file
fs.writeFileSync(resolversFile, resolversContent.trim());

console.log(`Successfully generated resource: ${resourceName}`);