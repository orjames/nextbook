'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

  return queryInterface.addColumn('reviews', 'rating', Sequelize.FLOAT)

  },

  down: (queryInterface, Sequelize) => {

  return queryInterface.addColumn('reviews', 'rating', Sequelize.FLOAT)

  }
};
