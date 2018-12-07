module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('customer', {
    id: {
      type: DataTypes.STRING(32),
      unique: true,
      primaryKey: true,
    },
    fName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
    },
    phone: {
      type: DataTypes.STRING(14),
    },
    logicalAddress: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      allowNull: false
    }
  })
  
  Customer.associate = (models) => {
    Customer.hasMany(models.customerCard, {
      as: 'cards',
      foreignKey: 'customerId',
      sourceKey: 'id'
    })
    
    Customer.hasMany(models.customerAccount, {
      as: 'accounts',
      foreignKey: 'customerId',
      sourceKey: 'id'
    })
    
    Customer.hasMany(models.customerWallet, {
      as: 'wallets',
      foreignKey: 'customerId',
      sourceKey: 'id'
    })
    
    Customer.hasMany(models.charge, {
      as: 'charges',
      foreignKey: 'customerId',
      sourceKey: 'id',
    })
    
    Customer.belongsToMany(models.plan, {
      through: {
        model: models.subscription,
        unique: false,
      },
    })
    
    Customer.belongsTo(models.business)
  }
  
  return Customer
}