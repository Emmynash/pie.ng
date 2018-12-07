module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    phone: {
      type: DataTypes.STRING(14),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    logicalAddress: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    activated: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      allowNull: false,
    },
  }, {
    timestamps: true,
    })
  
  User.associate = (models) => {
    User.belongsToMany(models.business, {
      through: {
        model: models.businessAdmin,
        unique: false,
      },
      constraints: false
    })
    
    User.hasMany(models.wallet, {
      onDelete: 'CASCADE',
    })
    
    User.belongsToMany(models.role, {
      through: {
        model: models.userRole,
        unique: false,
      },
      constraints: false,
      onDelete: 'CASCADE',
    })
  }
  return User
}