module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('invoice', {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    chargeId: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
  })
  return Invoice
}