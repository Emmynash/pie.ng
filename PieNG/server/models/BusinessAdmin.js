module.exports = (sequelize, DataTypes) => {
  const businessAdmin = sequelize.define('businessAdmin', {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    businessId: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'developer', 'auditor', 'custom'),
      allowNull: false,
    },
    roleDef: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  })
  
  return businessAdmin
}