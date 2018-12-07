'use strict';
module.exports = (sequelize, DataTypes) => {
  const Plan = sequelize.define('plan', {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    identifier: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    trialPeriod: {
      type: DataTypes.INTEGER(5),
      defaultValue: 0,
      allowNull: false
    },
  })
  
  Plan.associate = (models) => {
    Plan.belongsToMany(models.customer, {
      through: {
        model: models.subscription,
        unique: false,
      },
    })
  }
  
  return Plan
}