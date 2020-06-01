const language = (sequelize, DataTypes) => {
  const Language = sequelize.define(
    'language',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      timestamps: false,
    }
  );

  Language.associate = (models) => {
    models.language.hasMany(models.book, {
      foreignKey: 'lang',
    });
  };

  return Language;
};

module.exports = language;
