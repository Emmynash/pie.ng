module.exports = (sequelize, DataTypes) => {
  const CustomerAccount = sequelize.define('customerAccount', {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    livemode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    bankCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
  })
  
  CustomerAccount.associate = (models) => {
    CustomerAccount.belongsTo(models.customer, {
      as: 'customer',
      foreignKey: 'customerId',
      targetKey: 'id',
    })
    
    CustomerAccount.hasMany(models.charge, {
      as: 'charges',
      foreignKey: 'accountId',
      sourceKey: 'id',
    })
  }
  
  return CustomerAccount
}