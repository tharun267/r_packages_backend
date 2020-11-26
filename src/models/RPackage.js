const { rPackagesList } = require("../data");

class RPackage {

  constructor(Package, Version, Dependencies, Suggestions,
    PublishedOn, Title, Description, Authors, Maintainers, License) {
    this.Package = Package;
    this.Version = Version;
    this.Dependencies = Dependencies;
    this.Suggestions = Suggestions;
    this.PublishedOn = PublishedOn;
    this.Title = Title;
    this.Description = Description;
    this.Authors = Authors;
    this.Maintainers = Maintainers;
    this.License = License;
  }

  static all() {
    return rPackagesList.map((rPackage, i) => {
      const Dependencies = Array.isArray(rPackage.Depends) ? rPackage.Depends : [rPackage.Depends];
      const Suggestions = Array.isArray(rPackage.Suggests) ? rPackage.Suggests : [rPackage.Suggests];
      const PublishedOn = rPackage["Date/Publication"];
      const Title = Array.isArray(rPackage.Title) ? rPackage.Title.join(" ") : rPackage.Title;
      const Description = Array.isArray(rPackage.Description) ? rPackage.Description.join(" ") : rPackage.Description;
      const Authors = Array.isArray(rPackage.Author) ? rPackage.Author : [rPackage.Author];
      let Maintainers = Array.isArray(rPackage.Maintainer) ? rPackage.Maintainer : [rPackage.Maintainer];
      Maintainers = Maintainers.map(Maintainer => Maintainer.replace(">", "").replace("<", ""))
      return new RPackage(rPackage.Package, rPackage.Version, Dependencies,
        Suggestions, PublishedOn, Title, Description, Authors, Maintainers, rPackage.License)
    });
  }
}

module.exports = {
  RPackage,
};
