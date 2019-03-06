'use strict';
module.exports = (sequelize, DataTypes) => {
  const rating = sequelize.define('rating', {
    rating: DataTypes.FLOAT,
    userId: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER,
    reviewId: DataTypes.INTEGER
  }, {});
  rating.associate = function(models) {
    // associations can be defined here
    models.rating.belongsTo(models.review);
    models.rating.belongsTo(models.user);
    models.rating.belongsTo(models.book);
  };
  return rating;
};