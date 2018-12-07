module.exports = (sequelize, DataTypes) => {
  const CustomerCard = sequelize.define('customerCard', {
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
      allowNull: false
    },
    mName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    lName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    number: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    verification: {
      type: DataTypes.STRING(9),
    },
    pin: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    expMonth: {
      type: DataTypes.STRING(2)
    },
    expYear: {
      type: DataTypes.STRING(4),
    },
    type: {
      type: DataTypes.ENUM('visa', 'mastercard', 'verve'),
      allowNull: false,
    },
  })
  
  CustomerCard.associate = (models) => {
    CustomerCard.belongsTo(models.customer, {
      as: 'customer',
      foreignKey: 'customerId',
      targetKey: 'id',
    })
    
    CustomerCard.hasMany(models.charge, {
      as: 'charges',
      foreignKey: 'cardId',
      sourceKey: 'id',
    })
  }
  
  return CustomerCard
}