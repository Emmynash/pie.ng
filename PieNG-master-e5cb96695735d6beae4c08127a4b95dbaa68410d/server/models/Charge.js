module.exports = (sequelize, DataTypes) => {
  var Charge = sequelize.define('charge', {
    id: {
      type: DataTypes.STRING(32),
      unique: true,
      primaryKey: true,
    },
    amountToPay: {
      type: DataTypes.INTEGER(20),
      allowNull: true,
    },
    rawAmount: {
      type: DataTypes.INTEGER(20),
      allowNull: true,
    },
    serviceCharge: {
      type: DataTypes.INTEGER(20),
      defaultValue: 0,
    },
    businessCommission: {
      type: DataTypes.INTEGER(20),
      defaultStatus: 0,
    },
    netDebitAmount: {
      type: DataTypes.INTEGER(20),
    },
    moneywaveCommission: {
      type: DataTypes.INTEGER(20),
      defaultValue: 0
    },
    narration: {
      type: DataTypes.TEXT,
      comment: 'Transaction narration'
    },
    livemode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
    ipAddress: {
      type: DataTypes.STRING(15),
    },
    status: {
      type: DataTypes.ENUM('success', 'failure')
    },
    medium: {
      type: DataTypes.ENUM('web', 'mobile', 'sms', 'desktop'),
      defaultValue: 'web'
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'NGN',
    },
    chargeWith: {
      type: DataTypes.ENUM('card', 'account', 'wallet'),
      allowNull: false,
    },
    transactionToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    transactionRef: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null
    },
    authType: {
      type: DataTypes.STRING(20),
      defaultValue: 'OTP',
    },
    pendingValidation: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    paidAt: {
      type: DataTypes.DATE,
    },
    chargeType: {
      type: DataTypes.ENUM('transfer', 'payment'),
      allowNull: false,
      defaultValue: 'payment',
    },
    businessReference:{
      type: DataTypes.STRING(255),
    }
  }, {
    updatedAt: 'paidAt',
    validate: {
      tansactionRefAndTokenAllowNullWhenChargingFomWallet() {
        if((this.chargeWith !== 'wallet') && (this.transactionRef === null || this.transactionToken === null)) {
          throw new Error('transactionToken and transactionRef are required when transaction is not from a wallet')
        }
      }
    }
  })
  
  Charge.associate = (models) => {
    Charge.belongsTo(models.plan, {
      as: 'plan',
    })
    
    Charge.belongsTo(models.customer, {
      as: 'customer'
    })
    
    Charge.belongsTo(models.customerCard, {
      as: 'card'
    })
    
    Charge.belongsTo(models.customerAccount, {
      as: 'account',
    })
    
    Charge.belongsTo(models.wallet, {
      as: 'customerWallet',
      foreignKey: 'customerWalletId',
    })
    
    Charge.belongsTo(models.wallet, {
      as: 'sourceWallet',
      foreignKey: 'sourceWalletId',
    })
    
    Charge.belongsTo(models.wallet, {
      as: 'targetWallet',
      foreignKey: 'targetWalletId',
    })
    
    Charge.belongsTo(models.wallet, {
      as: 'businessWallet',
      foreignKey: 'walletId',
    })
    
    Charge.belongsTo(models.wallet, {
      as: 'commissionWallet',
      foreignKey: 'commissionWalletId',
    })
    
    Charge.belongsTo(models.business, {
      as: 'business'
    })
  }
  return Charge
}