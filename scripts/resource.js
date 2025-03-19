const { exec } = require('child_process');

// Get the resource name from the command line argument
const resourceName = process.argv[2];

if (!resourceName) {
  console.error('Please provide a resource name. Example: yarn resource users');
  process.exit(1);
}

// Run the generate-graphql-resource script
exec(`node scripts/generate-graphql.js ${resourceName}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error generating GraphQL resource: ${stderr}`);
    process.exit(1);
  }
  console.log(stdout);

  // Run the generate-db-resource script
  exec(`node scripts/generate-db.js ${resourceName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error generating DB resource: ${stderr}`);
      process.exit(1);
    }
    console.log(stdout);

    // Run the generate-service script
    exec(`node scripts/generate-service.js ${resourceName}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error generating service: ${stderr}`);
        process.exit(1);
      }
      console.log(stdout);
    });
  });
});