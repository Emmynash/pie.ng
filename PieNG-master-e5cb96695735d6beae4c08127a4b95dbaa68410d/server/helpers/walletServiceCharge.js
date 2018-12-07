const { toBoolean } = require('../helpers/generic')

const round = (value, decimals = 0) => (
  Number(Math.round(value+'e'+decimals)+'e-'+decimals)
)

module.exports = (amount = 0, inclusive = true, businessCommission = 0, pieServiceChargeAbs = 140) => {
  amount = parseFloat(amount)
  inclusive = toBoolean(inclusive)
  businessCommission = parseFloat(businessCommission)
  /*if(inclusive && amount < (businessCommission + pieServiceChargeAbs)) {
    throw new Error('Amount must be greater than service charges combined')
  }*/
  const percentage = 1, baseFee = pieServiceChargeAbs
  let gateWayCommission = baseFee
  let allCommissions = gateWayCommission + businessCommission
  // Round shit up!
  allCommissions = (allCommissions)
  if(inclusive) {
    amount = amount - allCommissions
  }
  let totalAmount = allCommissions + amount
  
  amount = round(amount)
  gateWayCommission = round(gateWayCommission)
  businessCommission = round(businessCommission)
  allCommissions = round(allCommissions)
  totalAmount = round(totalAmount)
  
  return {
    amount: amount * 100,
    gateWayCommission: gateWayCommission * 100,
    businessCommission: businessCommission * 100,
    allCommissions: allCommissions * 100,
    totalAmount: totalAmount * 100,
  }
}