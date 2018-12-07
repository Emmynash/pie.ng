module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('userRole', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    }, {
      timestamps: true,
    })
  
  UserRole.associate = (models) => {
    
    UserRole.belongsTo(models.user, {
      as: 'user'
    })
    
    UserRole.belongsTo(models.role, {
      as: 'role'
    })
    
  }
  return UserRole
}