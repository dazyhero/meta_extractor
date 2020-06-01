module.exports = class SubjectController {
  constructor(subjectModel) {
    this.subjectModel = subjectModel;
  }

  bulkCreate(subjects) {
    return this.subjectModel.bulkCreate(subjects, {
      ignoreDuplicates: true,
      returning: true,
    });
  }

  findOrCreate(name) {
    return this.subjectModel.findOrCreate({
      where: {
        name,
      },
    });
  }
};
