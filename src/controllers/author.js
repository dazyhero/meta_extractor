module.exports = class AuthorController {
  constructor(authorModel) {
    this.authorModel = authorModel;
  }

  findOrCreate(name) {
    return this.authorModel.findOrCreate({
      where: {
        name,
      },
    });
  }

  bulkCreate(authors) {
    return this.authorModel.bulkCreate(authors, {
      ignoreDuplicates: true,
      returning: true,
    });
  }
};
