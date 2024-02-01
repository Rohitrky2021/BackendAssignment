// Utils
const logger = require('../utils/logs');
const { DB_MODELS } = require('../utils/modelEnums');

// Models
const { sequelize } = require('../db/models');

// Helpers and services
const JsonHelper = require('../helpers/json');
const SequelizeHelper = require('../helpers/sequelize');

// Function to create a single record
const create = async ({ tableName, createObject, extras, t }) => {
  try {
    const modelName = DB_MODELS[tableName];

    // Use Sequelize to create a record with transaction and additional options
    const createdObject = await modelName.create(createObject, {
      transaction: t,
      ...extras,
    });

    return [JsonHelper.parse(createdObject), null]; // Return the created record
  } catch (err) {
    // Handle errors during creation
    if (err?.errors?.[0]?.message) {
      let msg = err.errors[0].message;
      logger.error(`Error while creating ${tableName}: ${msg}`);
      return [null, msg];
    }
    logger.error(`Error while creating ${tableName}: `, err);
    return [null, err.message];
  }
};

// Function to create multiple records in bulk
const bulkCreate = async ({ tableName, createObject, extras, t }) => {
  try {
    const modelName = DB_MODELS[tableName];

    // Use Sequelize to bulk create records with transaction and additional options
    const createdObjects = await modelName.bulkCreate(createObject, {
      transaction: t,
      ...extras,
    });

    return [JsonHelper.parse(createdObjects), null]; // Return the created records
  } catch (err) {
    // Handle errors during bulk creation
    if (err?.errors?.[0]?.message) {
      let msg = err.errors[0].message;
      logger.error(`Error while creating ${tableName}(bulk): ${msg}`);
      return [null, msg];
    }
    logger.error(`Error while creating ${tableName}(bulk): `, err);
    return [null, err.message];
  }
};

// Function to fetch a single record
const fetchOne = async ({ tableName, query, include = [], extras, t }) => {
  try {
    const modelName = DB_MODELS[tableName];

    let errForInclude = '';

    // Get an array of includes for Sequelize
    [include, errForInclude] = SequelizeHelper.getIncludeArray(include);

    if (errForInclude) return [null, errForInclude];

    // Use Sequelize to find a single record with transaction and additional options
    const data = await modelName.findOne({
      where: query,
      include,
      ...extras,
      transaction: t,
    });

    return [JsonHelper.parse(data), null]; // Return the fetched record
  } catch (err) {
    // Handle errors during fetching
    logger.error(`Error while fetching ${tableName}: `, err);
    return [null, err.message];
  }
};

// Function to fetch multiple records
const fetchAll = async ({ tableName, query, include = [], extras, t }) => {
  try {
    const modelName = DB_MODELS[tableName];

    let errForInclude = '';

    // Get an array of includes for Sequelize
    [include, errForInclude] = SequelizeHelper.getIncludeArray(include);

    if (errForInclude) return [null, errForInclude];

    // Use Sequelize to find all records with transaction and additional options
    const data = await modelName.findAll({
      where: query,
      include,
      ...extras,
      transaction: t,
    });

    return [JsonHelper.parse(data), null]; // Return the fetched records
  } catch (err) {
    // Handle errors during fetching
    logger.error(`Error while fetching ${tableName}(All): `, err);
    return [null, err.message];
  }
};

const update = async ({ tableName, updateObject, query, extras, t }) => {
  try {
    const modelName = DB_MODELS[tableName];
    const data = await modelName.update(updateObject, {
      where: query,
      transaction: t,
      ...extras,
    });

    return [JsonHelper.parse(data), null];
  } catch (err) {
    if (err?.errors?.[0]?.message) {
      let msg = err.errors[0].message;
      logger.error(`Error while updating ${tableName}: ${msg}`);
      return [null, msg];
    }
    logger.error(`Error while updating ${tableName}: `, err);
    return [null, err.message];
  }
};

const destroy = async ({ tableName, query, t }) => {
  try {
    const modelName = DB_MODELS[tableName];
    const data = await modelName.destroy({
      where: query,
      transaction: t,
    });

    return [JsonHelper.parse(data), null];
  } catch (err) {
    logger.error(`Error while deleting ${tableName}: `, err);
    return [null, err.message];
  }
};

const count = async ({ tableName, query, include = [], extras, t }) => {
  try {
    const modelName = DB_MODELS[tableName];

    let errForInclude = '';

    [include, errForInclude] = SequelizeHelper.getIncludeArray(include);

    if (errForInclude) return [null, errForInclude];

    const data = await modelName.count({
      where: query,
      include,
      ...extras,
      transaction: t,
    });

    return [JsonHelper.parse(data), null];
  } catch (err) {
    logger.error(`Error while fetching count for ${tableName}: `, err);
    return [null, err.message];
  }
};
/**
 * @param {string} rawQuery - raw sql query
 * @param {sequelize.model} tableName - your base table for the raw query( should be a value from DB_MODELS )
 * @param {Object} include - json for the structure of your joins in the query (will be identical to sequelize format for include but will only contain model names)
 * @param {string} replacements - object for params you have passed in your rawQuery
 * @param {string} hasJoin - true if your query has a join else false ( default true )
 * @param {Object} extras - anything extra you want to pass other than function arguments
 * */

const runRawQuery = async ({
  rawQuery,
  tableName,
  include,
  replacements,
  hasJoin = true,
  extras = {},
}) => {
  const options = {
    include,
  };
  try {
    tableName._validateIncludedElements(options);
    let result = await sequelize.query(rawQuery, {
      raw: false,
      nest: true,
      replacements,
      model: tableName,
      hasJoin,
      mapToModel: true,
      ...options,
      ...extras,
    });
    return [result, null];
  } catch (err) {
    logger.error(`Error while executing raw query: `, err);
    return [null, err.message];
  }
};

const runRawUpdateQuery = async ({ rawQuery }) => {
  try {
    let result = await sequelize.query(rawQuery);
    return [result, null];
  } catch (err) {
    logger.error(`Error while running raw update query `, err);
    return [null, err.message];
  }
};

const Repository = {
  create,
  bulkCreate,
  fetchOne,
  fetchAll,
  update,
  destroy,
  count,
  runRawQuery,
  runRawUpdateQuery,
};

module.exports = Repository;
