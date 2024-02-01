// Utils
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Db
const dbModels = require('../db/models'); // Import database models
const logger = require('./logger'); // Import logger utility

const MODEL_ENUMS_FILE_NAME = 'modelEnums.js'; // Name of the file to be generated

// Define the path for the model enums file
const MODEL_ENUMS_FILE_PATH = path.resolve(__dirname, './', MODEL_ENUMS_FILE_NAME);

// Delete unwanted data from dbModels
delete dbModels.sequelize;
delete dbModels.Sequelize;

let DB_TABLES = {}; // Object to hold table names
let DB_MODELS = {}; // Object to hold model names
let all_models = []; // Array to hold all model names
let contentForFile = ``; // Content to be written to the file

// Iterate over the database models and populate DB_TABLES, DB_MODELS, and all_models
Object.keys(dbModels).map((model_name) => {
  DB_TABLES[model_name.toUpperCase()] = model_name.toLowerCase();
  DB_MODELS[model_name.toLowerCase()] = model_name;
  all_models.push(model_name);
});

const dbModelsRequireStatement = `const { ${all_models.join(',')} } = require("../db/models")`;

// Prepare content for the file
contentForFile =
  dbModelsRequireStatement +
  '\n\n' +
  `const DB_TABLES = ${JSON.stringify(DB_TABLES)}` +
  '\n\n';

contentForFile += `const DB_MODELS = {\n`;

Object.keys(DB_MODELS).map(
  (key) => (contentForFile += `"${key}": ${DB_MODELS[key]},\n`)
);

contentForFile += `}` + '\n\n';

contentForFile += `module.exports = { DB_TABLES,DB_MODELS }`;

logger.info(contentForFile);

// Check if the file already exists and delete it if it does
if (fs.existsSync(MODEL_ENUMS_FILE_PATH)) {
  logger.info(`Deleting ${MODEL_ENUMS_FILE_PATH}`);
  fs.unlinkSync(MODEL_ENUMS_FILE_PATH);
}

// Write content to the file
fs.appendFileSync(MODEL_ENUMS_FILE_PATH, contentForFile);

logger.info(`Content written to ${MODEL_ENUMS_FILE_PATH}.`);

// Escape the file path for use with command line
let MODEL_ENUMS_FILE_ESCAPED_PATH = MODEL_ENUMS_FILE_PATH.replace(/ /g, '\\ ');

logger.info(`Applying prettier to ${MODEL_ENUMS_FILE_ESCAPED_PATH}...`);

// Run prettier to format the file
exec(
  `npx prettier --write ${MODEL_ENUMS_FILE_ESCAPED_PATH}`,
  (err, stdout, stderr) => {
    if (err)
      logger.error(
        `Error occurred while generating ${MODEL_ENUMS_FILE_ESCAPED_PATH}: `,
        err
      );
    logger.info(`STDOUT: `, stdout);
    logger.info(`STDERR: `, stderr);
  }
);
