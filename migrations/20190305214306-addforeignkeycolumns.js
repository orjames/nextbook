'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    
  return queryInterface.addColumn('ratings', 'userId', Sequelize.INTEGER).then(() => {
          queryInterface.addColumn('ratings', 'bookId', Sequelize.INTEGER)}).then(() => {
          queryInterface.addColumn('ratings', 'reviewId', Sequelize.INTEGER)}).then(() => {
          queryInterface.addColumn('reviews', 'userId', Sequelize.INTEGER)}).then(() => {
          queryInterface.addColumn('reviews', 'bookId', Sequelize.INTEGER)}).then(() => {
          queryInterface.addColumn('reviews', 'ratingId', Sequelize.INTEGER)}).then(() => {
          queryInterface.addColumn('genres', 'bookId', Sequelize.INTEGER)})
    
    /*
      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
    
  return queryInterface.addColumn('ratings', 'userId').then(() => {
      queryInterface.addColumn('ratings', 'bookId')}).then(() => {
      queryInterface.addColumn('ratings', 'reviewId')}).then(() => {
      queryInterface.addColumn('reviews', 'userId')}).then(() => {
      queryInterface.addColumn('reviews', 'bookId')}).then(() => {
      queryInterface.addColumn('reviews', 'ratingId')}).then(() => {
      queryInterface.addColumn('genres', 'bookId')})
    
    /*
      Example:
      return queryInterface.dropTable('users');
    */
  }
};
