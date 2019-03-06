'use strict';
module.exports = (sequelize, DataTypes) => {
  const userBook = sequelize.define('userBook', {
    userId: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER
  }, {});
  userBook.associate = function(models) {
    // associations can be defined here
  };
  return userBook;
};