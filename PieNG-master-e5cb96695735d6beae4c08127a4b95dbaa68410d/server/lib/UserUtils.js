import models from '../models'

export const UserCharges = (user) => {
  return new Promise((resolve, reject) => {
    models.charge.findAll({
      where: { walletId: {  $in: user.wallets.map(wallet => (wallet.id)) } },
      // where: { $or: [{ walletId: {  $in: user.wallets.map(wallet => (wallet.id)) } }, { customerWalletId: {  $in: user.wallets.map(wallet => (wallet.id)) } }] },
      attributes: {
        include: ['id', 'amountToPay', 'narration', 'chargeType', 'paidAt']
      },
      // order: ['paidAt DESC']
    }).then(charges => {
      resolve(charges)
    }).catch(error => {
      reject(error)
    })
  })
}