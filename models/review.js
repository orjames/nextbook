'use strict';
module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define('review', {
    text: DataTypes.TEXT,
    date: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER,
    ratingId: DataTypes.INTEGER
  }, {});
  review.associate = function(models) {
    // associations can be defined here
    models.review.belongsTo(models.rating);
    models.review.belongsTo(models.user);
    models.review.belongsTo(models.book);
  };
  return review;
};