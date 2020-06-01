module.exports = class LanguageController {
  constructor(languageModel) {
    this.languageModel = languageModel;
  }

  findOrCreate(name) {
    return this.languageModel.findOrCreate({
      where: {
        name,
      },
    });
  }
};
