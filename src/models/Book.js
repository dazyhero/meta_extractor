const book = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    'book',
    {
      id: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        validate: {
          min: 0,
          max: 999999,
          notEmpty: false,
        },
      },
      lang: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      publisher: {
        type: DataTypes.STRING,
        default: 'Gutenberg',
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      publicationDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      license: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      timestamps: false,
    }
  );

  Book.associate = (models) => {
    models.book.belongsTo(models.language, { foreignKey: 'lang' });
    models.book.belongsToMany(models.author, {
      through: 'author_books',
      foreignKey: 'bookId',
      otherKey: 'authorName',
    });
    models.book.belongsToMany(models.subject, {
      through: 'subject_books',
      foreignKey: 'bookId',
      otherKey: 'subjectName',
    });
  };

  return Book;
};

module.exports = book;
