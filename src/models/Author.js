const author = (sequelize, DataTypes) => {
  const Author = sequelize.define(
    'author',
    {
      name: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      timestamps: false,
    }
  );

  Author.associate = (models) => {
    models.author.belongsToMany(models.book, {
      through: 'author_books',
      foreignKey: 'authorName',
      otherKey: 'bookId',
    });
  };

  return Author;
};

module.exports = author;
