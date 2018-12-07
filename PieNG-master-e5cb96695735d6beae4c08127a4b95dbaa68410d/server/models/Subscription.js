module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('subscription', {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    planId: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    customerId: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
  })
  return Subscription
}