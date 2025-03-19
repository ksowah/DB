const fs = require('fs');
const path = require('path');

// Get the resource name from the command line argument
const resourceName = process.argv[2];

if (!resourceName) {
  console.error('Please provide a resource name. Example: yarn generate-service clients');
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
const servicesFolder = path.join(__dirname, '..', 'src', 'services');
const serviceFile = path.join(servicesFolder, `${singularize(resourceName)}.ts`); // Use singular form for file name
const centralIndexFile = path.join(servicesFolder, 'index.ts');

// Create the services folder if it doesn't exist
if (!fs.existsSync(servicesFolder)) {
  fs.mkdirSync(servicesFolder, { recursive: true });
}

// Generate the service file content
const serviceContent = `
import { ${capitalize(resourceName)}Model } from "../models";

export const get${capitalize(resourceName)} = async () => {
  return await ${capitalize(resourceName)}Model.find();
};

export const get${capitalize(singularize(resourceName))}ById = async (id: string) => {
  return await ${capitalize(resourceName)}Model.findById(id);
};

export const create${capitalize(singularize(resourceName))} = async (input: any) => {
  return await ${capitalize(resourceName)}Model.create(input);
};

export const update${capitalize(singularize(resourceName))} = async (id: string, input: any) => {
  return await ${capitalize(resourceName)}Model.findByIdAndUpdate(id, input, { new: true });
};

export const delete${capitalize(singularize(resourceName))} = async (id: string) => {
  return await ${capitalize(resourceName)}Model.findByIdAndDelete(id);
};
`;

// Write the service file
fs.writeFileSync(serviceFile, serviceContent.trim());

// Update the central index.ts file
if (fs.existsSync(centralIndexFile)) {
  const centralIndexContent = fs.readFileSync(centralIndexFile, 'utf8');

  // Check if the resource is already imported
  const importStatement = `import * as ${resourceName} from './${singularize(resourceName)}';`;
  if (!centralIndexContent.includes(importStatement)) {
    // Append the new import statement
    fs.appendFileSync(centralIndexFile, `\n${importStatement}\n`);
  }

  // Check if the resource is already exported
  const exportStatement = `  ${resourceName},`;
  if (!centralIndexContent.includes(exportStatement)) {
    // Append the new export to the `export default` object
    const updatedContent = centralIndexContent.replace(
      /export default \{([\s\S]*?)\};/,
      `export default {$1  ${resourceName},\n};`
    );
    fs.writeFileSync(centralIndexFile, updatedContent);
  }
} else {
  // Create the central index.ts file with the new service
  const initialContent = `
import * as ${resourceName} from './${singularize(resourceName)}';

export default {
  ${resourceName},
};
`;
  fs.writeFileSync(centralIndexFile, initialContent.trim());
}

console.log(`Successfully generated service: ${resourceName}`);