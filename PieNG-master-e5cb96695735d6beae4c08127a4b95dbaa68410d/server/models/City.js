'use strict';
module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('city', {
    id: {
      type: DataTypes.INTEGER(32),
      primaryKey: true,
    },
    cityCode: {
      type: DataTypes.STRING(6),
      unique: true,
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }
  });
  
  City.associate = (models) => {
    City.belongsTo(models.country, {
      as: "country",
      foreignKey: "countryCode",
      targetKey: "countryCode"
    });
    // City.hasMany(models.business, {
    //   as: "businesses",
    //   foreignKey: "cityCode",
    //   sourceKey: "cityCode"
    // });
  };
  
  return City;
};