module.exports = (sequelize, DataTypes) => {
  const VerificationCode = sequelize.define('verificationCode', {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    verificationCode: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }
  })
  
  VerificationCode.associate = (models) => {
    VerificationCode.belongsTo(models.user)
  }
  return VerificationCode
}