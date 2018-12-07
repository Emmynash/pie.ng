module.exports = (sequelize, DataTypes) => {
  const Bank = sequelize.define('bank', {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    bankCode: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  })
  return Bank
}