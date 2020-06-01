'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('books', {
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        validate: {
          min: 0,
          max: 99999,
          notEmpty: false,
        },
      },
      lang: {
        type: Sequelize.STRING,
        references: {
          model: 'languages',
          key: 'name',
        },
        allowNull: true,
      },
      publisher: {
        type: Sequelize.STRING,
        default: 'Gutenberg',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      publicationDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      license: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
    });
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('books');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
