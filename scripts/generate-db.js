const fs = require('fs');
const path = require('path');

// Get the resource name from the command line argument
const resourceName = process.argv[2];

if (!resourceName) {
  console.error('Please provide a resource name. Example: yarn generate-db-resource users');
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
const modelsFolder = path.join(__dirname, '../src', 'models');
const resourceFolder = path.join(modelsFolder, resourceName);
const typesFile = path.join(resourceFolder, 'index.types.ts');
const schemaFile = path.join(resourceFolder, 'index.ts');
const centralIndexFile = path.join(modelsFolder, 'index.ts');
const centralTypesFile = path.join(modelsFolder, 'index.types.ts');

// Create the resource folder
if (!fs.existsSync(resourceFolder)) {
  fs.mkdirSync(resourceFolder, { recursive: true });
}

// Generate the index.types.ts content
const typesContent = `
import type { Document } from "mongoose";

export interface I${capitalize(singularize(resourceName))} {

  // Add more fields as needed
}

export interface I${capitalize(singularize(resourceName))}Document extends Document, I${capitalize(singularize(resourceName))} {}
`;

// Generate the index.ts content (Mongoose schema and model)
const schemaContent = `
import { model, Schema, SchemaTypes } from "mongoose";
import { I${capitalize(singularize(resourceName))}Document } from "./index.types";

export const ${capitalize(resourceName)}Schema = new Schema<I${capitalize(singularize(resourceName))}Document>(
  {
    // Define your schema fields here
    id: {
      type: SchemaTypes.String,
      required: true,
      unique: true,
    },
    // Add more fields as needed
  },
  {
    timestamps: true,
  }
);

export const ${capitalize(resourceName)}Model = model<I${capitalize(singularize(resourceName))}Document>("${capitalize(resourceName)}", ${capitalize(resourceName)}Schema);
`;

// Write the index.types.ts file
fs.writeFileSync(typesFile, typesContent.trim());

// Write the index.ts file
fs.writeFileSync(schemaFile, schemaContent.trim());

// Update the central index.types.ts file
if (fs.existsSync(centralTypesFile)) {
  const centralTypesContent = fs.readFileSync(centralTypesFile, 'utf8');
  const newExport = `export * from "./${resourceName}/index.types";`;
  if (!centralTypesContent.includes(newExport)) {
    fs.appendFileSync(centralTypesFile, `\n${newExport}\n`);
  }
} else {
  fs.writeFileSync(centralTypesFile, `export * from "./${resourceName}/index.types";\n`);
}

// Update the central index.ts file
if (fs.existsSync(centralIndexFile)) {
  const centralIndexContent = fs.readFileSync(centralIndexFile, 'utf8');
  const newExport = `export { ${capitalize(resourceName)}Model } from "./${resourceName}";`;
  if (!centralIndexContent.includes(newExport)) {
    fs.appendFileSync(centralIndexFile, `\n${newExport}\n`);
  }
} else {
  fs.writeFileSync(centralIndexFile, `export { ${capitalize(resourceName)}Model } from "./${resourceName}";\n`);
}

console.log(`Successfully generated DB resource: ${resourceName}`);