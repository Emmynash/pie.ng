module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('role', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role:{
      type: DataTypes.STRING(255),
      index: true,
      allowNull: false,
    },
    slug:{
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    }
  }, {
    timestamps: true,
    })
  
  Role.associate = (models) => {

    Role.hasMany(models.permission, {
      as: 'permissions',
      foreignKey: 'roleId',
      sourceKey: 'id',
      onDelete: 'CASCADE',
    })
    
  }
  return Role
}