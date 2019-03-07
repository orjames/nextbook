'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

  return queryInterface.removeColumn('reviews', 'date')

  },

  down: (queryInterface, Sequelize) => {

  return queryInterface.removeColumn('reviews', 'date')

  }
};
