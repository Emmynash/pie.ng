module.exports = (sequelize, DataTypes) => {
  const Wallet = sequelize.define('wallet', {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    tag: {
      type: DataTypes.STRING(255),
      defaultValue: 'default',
      allowNull: false,
    },
    walletType: {
       type: DataTypes.ENUM('personal', 'business'),
       defaultValue: 'business',
       allowNull: false
    },
    currentBalance: {
      type: DataTypes.DOUBLE(18,2),
      allowNull: false,
      defaultValue: 0,
    },
    previousBalance: {
      type: DataTypes.DOUBLE(18,2),
      allowNull: false,
      defaultValue: 0,
    },
    testCurrentBalance: {
      type: DataTypes.DOUBLE(18,2),
      allowNull: false,
      defaultValue: 0,
    },
    testPreviousBalance: {
      type: DataTypes.DOUBLE(18,2),
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'NGN',
      allowNull: false
    }
  })
  
  Wallet.associate = (models) => {
    Wallet.belongsTo(models.business, {
      as: 'business',
      unique: false,
    })
    
    Wallet.belongsTo(models.user, {
      as: 'user',
      unique: false,
    })
    
    Wallet.hasMany(models.charge, {
      as: 'charges',
    })
    
    Wallet.hasMany(models.charge, {
      as: 'commission',
      foreignKey: 'commissionWalletId',
      sourceKey: 'id',
    })
  }
  
  return Wallet
}
