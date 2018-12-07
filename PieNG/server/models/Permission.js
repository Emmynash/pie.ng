module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('permission', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      permissions:{
        type: DataTypes.TEXT,
      }
    }, {
      timestamps: true,
    })
  
  Permission.associate = (models) => {

    Permission.belongsTo(models.role, {
      as: 'role'
    })
    
  }
  return Permission
}