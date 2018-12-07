module.exports = (sequelize, DataTypes) => {
  const CustomerWallet = sequelize.define('customerWallet', {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    livemode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    fName: {
      type: DataTypes.STRING(255),
    },
    mName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    lName: {
      type: DataTypes.STRING(255)
    },
  })
  
  CustomerWallet.associate = (models) => {
    CustomerWallet.belongsTo(models.customer, {
      as: 'customer',
      foreignKey: 'customerId',
      targetKey: 'id',
    })
    
    CustomerWallet.hasMany(models.charge, {
      as: 'charges',
      foreignKey: 'cardId',
      sourceKey: 'id',
    })
    
    CustomerWallet.belongsTo(models.wallet, {
      as: 'wallet',
    })
  }
  
  return CustomerWallet
}