'use strict';
module.exports = (sequelize, DataTypes) => {
  const userGenre = sequelize.define('userGenre', {
    userId: DataTypes.INTEGER,
    genreId: DataTypes.INTEGER
  }, {});
  userGenre.associate = function(models) {
    // associations can be defined here
  };
  return userGenre;
};