module.exports = (sequelize, DataTypes) => {
  const TransactionOTP = sequelize.define('transactionOtp', {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    otp: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
  })
  
  TransactionOTP.associate = (models) => {
    TransactionOTP.belongsTo(models.charge)
  }
  return TransactionOTP
}