'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    
  return  queryInterface.addColumn('reviews', 'userId', Sequelize.INTEGER).then(() => {
          queryInterface.addColumn('reviews', 'bookId', Sequelize.INTEGER)}).then(() => {
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
    
  return 
      queryInterface.removeColumn('reviews', 'userId').then(() => {
      queryInterface.removeColumn('reviews', 'bookId')}).then(() => {
      queryInterface.removeColumn('genres', 'bookId')})
    
    /*
      Example:
      return queryInterface.dropTable('users');
    */
  }
};
