module.exports = (sequelize, DataTypes) => {
  const Business = sequelize.define('business', {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    logoUrl: {
      type: DataTypes.STRING(255),
      defaultValue: '',
    },
    apiKey: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    apiSecret: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    testApiKey: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    testApiSecret: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    logicalAddress: {
      type: DataTypes.STRING(10),
    },
    activated: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
      allowNull: false
    },
    livemode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'For dashboard purposes only!'
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(14),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
    },
    transactionChargeRel: {
      type: DataTypes.DECIMAL(2,2),
      defaultValue: 0,
      comment: 'Custom charge for businesses expressed in percentage'
    },
    transactionChargeAbs: {
      type: DataTypes.INTEGER(20),
      defaultValue: 0,
      comment: 'Absolute custom charge for businesses to be added to transactionChargeRel in Naira'
    },
    walletTransactionChargeRel: {
      type: DataTypes.DECIMAL(2,2),
      defaultValue: 0,
      comment: 'Custom charge for businesses expressed in percentage'
    },
    walletTransactionChargeAbs: {
      type: DataTypes.INTEGER(20),
      defaultValue: 0,
      comment: 'Absolute custom charge for businesses to be added to transactionChargeRel in Naira'
    },
    mwLivePubKey: {
      type: DataTypes.STRING(255),
    },
    mwLiveSecretKey: {
      type: DataTypes.STRING(255),
    }
  })
  
  Business.associate = (models) => {
    Business.belongsToMany(models.user, {
      through: {
        model: models.businessAdmin,
        unique: false,
      },
      constraints: false
    })
    
    Business.hasMany(models.customer, {
      as: 'customers',
      foreignKey: 'businessId',
      sourceKey: 'id',
    })
    
    Business.hasMany(models.wallet, {
      as: 'wallets',
      foreignKey: 'businessId',
      sourceKey: 'id',
    })
    
    Business.hasMany(models.charge, {
      as: 'charges',
      foreignKey: 'businessId',
      sourceKey: 'id'
    })
  }
  
  return Business
}