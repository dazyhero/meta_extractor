const authorBooks = (sequelize, DataTypes) => {
  const AuthorBooks = sequelize.define(
    'author_books',

    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      authorName: {
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

  return AuthorBooks;
};

module.exports = authorBooks;
