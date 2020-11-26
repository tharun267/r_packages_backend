const { gql } = require("apollo-server");

const query = gql`
  type Query {
    rPackages: [RPackage]
  }
`;

module.exports = {
  query,
};
