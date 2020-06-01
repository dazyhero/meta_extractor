const subject = (sequelize, DataTypes) => {
  const Subject = sequelize.define(
    'subject',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      timestamps: false,
    }
  );

  Subject.associate = (models) => {
    models.subject.belongsToMany(models.book, {
      through: 'subject_books',
      foreignKey: 'subjectName',
      otherKey: 'bookId',
    });
  };

  return Subject;
};

module.exports = subject;
