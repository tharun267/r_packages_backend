const { query } = require("./query");
const { rPackageType } = require("./types");

const typeDefs = [query, rPackageType];

module.exports = {
  typeDefs,
};
