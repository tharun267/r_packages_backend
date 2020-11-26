const { gql } = require("apollo-server");

const rPackageType = gql`
  type RPackage {
    Package: String
    Version: String

    Dependencies: [String]
    Suggestions: [String]
    PublishedOn: String
    Title: String
    Description: String
    Authors: [String]
    Maintainers: [String]
    License: String
  }
`;

module.exports = {
  rPackageType,
};
