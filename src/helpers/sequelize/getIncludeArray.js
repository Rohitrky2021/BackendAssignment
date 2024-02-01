// Utils
const logger = require('../../utils/logs'); // Import logger module
const { DB_TABLES, DB_MODELS } = require('../../utils/modelEnums'); // Import DB_TABLES and DB_MODELS constants

/*
 * Should receive inputObject as {} with key as Model you want to include and Value as an {}  with whatever you want to pass it with sequelize
 * */
const getIncludeObject = (inputObject) => {
  try {
    let includeObject = {};
    const dbModels = Object.values(DB_TABLES);
    const inputObjectKeys = Object.keys(inputObject);

    if (inputObjectKeys.length !== 1) {
      logger.error(`Input object must contain only model as key.`);
      return [null, `Input object must contain only model as key.`];
    }

    const inputObjectKey = inputObjectKeys[0];

    // Only if key is a model
    if (dbModels.includes(inputObjectKey)) {
      includeObject.model = DB_MODELS[inputObjectKey];

      // Iterate over keys and values of inputObject
      Object.keys(inputObject[inputObjectKey]).map((key) => {
        if (dbModels.includes(key)) {
          // Recursively call getIncludeObject if key is a model
          const [value, err] = getIncludeObject({
            [key]: inputObject[inputObjectKey][key],
          });
          if (err) return [null, err];
          if (value) {
            if (includeObject.include) includeObject.include.push(value);
            else includeObject.include = [value];
          }
        } else includeObject[key] = inputObject[inputObjectKey][key];
      });
    } else {
      logger.error(`Input object key should be a db model.`);
      return [null, `Input object key should be a db model.`];
    }
    return [includeObject, null];
  } catch (err) {
    logger.error(`Error while calculating include object: `, err);
    return [null, `Error while calculating include object: ${err.message}`];
  }
};

// Function to convert includeObject to include array
const getIncludeArray = (includeObject) => {
  try {
    let include = [];

    // Iterate over keys of includeObject
    Object.keys(includeObject).map((includeObjectKey) => {
      const [value, err] = getIncludeObject({
        [includeObjectKey]: includeObject[includeObjectKey],
      });
      if (err) return [null, err];
      if (value) include.push(value);
    });

    return [include, null];
  } catch (err) {
    logger.error(`Error while calculating include array: `, err);
    return [null, err.message];
  }
};

module.exports = getIncludeArray;
