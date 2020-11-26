const { RPackage } = require("../models");

const rPackageResolvers = {
  Query: {
    // Available Args [parent, args, context, info]
    rPackages: () => RPackage.all(),
  },
};

module.exports = {
  rPackageResolvers,
}
