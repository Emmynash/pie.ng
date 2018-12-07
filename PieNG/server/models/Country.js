'use strict';
module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define('country', {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    countryCode: {
      type: DataTypes.STRING(2),
      unique: true,
      allowNull: false,
    },
    dialCode: {
      type: DataTypes.STRING(4),
      allowNull: false,
      unique: true,
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }
  })
  
  Country.associate = (models) => {
    // Country.hasMany(models.business, {
    //   as: "businesses",
    //   foreignKey: "countryCode",
    //   sourceKey: "countryCode"
    // });
    Country.hasMany(models.city, {
      as: "cities",
      foreignKey: "countryCode",
      sourceKey: "countryCode"
    });
  };
  
  return Country;
};