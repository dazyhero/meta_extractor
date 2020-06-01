const subjectBooks = (sequelize, DataTypes) => {
  const SubjectBooks = sequelize.define(
    'subject_books',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      subjectName: {
        type: DataTypes.STRING,
      },
      bookId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: false,
    }
  );

  return SubjectBooks;
};

module.exports = subjectBooks;
