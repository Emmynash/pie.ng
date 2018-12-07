module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('transaction', {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    transactionType: {
      type: DataTypes.ENUM('debit', 'credit'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DOUBLE(18,2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'NGN',
    },
    narration: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    livemode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  })
  
  Transaction.associate = (models) => {
    Transaction.belongsTo(models.wallet)
    Transaction.belongsTo(models.charge)
  }
  
  return Transaction
}