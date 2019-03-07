'use strict';
module.exports = (sequelize, DataTypes) => {
  const book = sequelize.define('book', {
    book_link: DataTypes.TEXT,
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    isbn: DataTypes.STRING,
    genre: DataTypes.STRING
  }, {});
  book.associate = function(models) {
    // associations can be defined here
    models.book.hasMany(models.review);
    models.book.belongsToMany(models.user, {through: "userBook"});
  };
  return book;
};