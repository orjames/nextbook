'use strict';
module.exports = (sequelize, DataTypes) => {
  const genre = sequelize.define('genre', {
    name: DataTypes.STRING,
    bookId: DataTypes.INTEGER
  }, {});
  genre.associate = function(models) {
    // associations can be defined here
    models.genre.belongsToMany(models.user, {through: "userGenre"})
  };
  return genre;
};