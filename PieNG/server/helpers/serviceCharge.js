const { toBoolean } = require('../helpers/generic')

const round = (value, decimals = 0) => (
  Number(Math.round(value+'e'+decimals)+'e-'+decimals)
)

module.exports = (amount = 0, inclusive = true, businessCommission = 0, calcFormular = null) => {
  amount = parseFloat(amount)
  inclusive = toBoolean(inclusive)
  // businessCommission = parseFloat(businessCommission)
  businessCommission = 0
  const percentage = 0.015, baseFee = 100
  const mwPercentage = 0.014, mwBaseFee = 10
  let moneywaveCommission = (mwPercentage * amount) + mwBaseFee
  // let gateWayCommission = (percentage * (amount + businessCommission)) + baseFee - moneywaveCommission
  let gateWayCommission = 0
  let allCommissions = gateWayCommission + businessCommission
  if(inclusive){
    amount = amount - allCommissions
  }
  // Round shit up!
  let totalAmount = allCommissions + amount
  amount = round(amount)
  gateWayCommission = round(gateWayCommission)
  businessCommission = round(businessCommission)
  moneywaveCommission = round(moneywaveCommission)
  allCommissions = round(allCommissions)
  totalAmount = round(totalAmount)
  
  return {
    amount: amount * 100,
    gateWayCommission: gateWayCommission * 100,
    businessCommission: businessCommission * 100,
    moneywaveCommission: moneywaveCommission * 100,
    allCommissions: allCommissions * 100,
    totalAmount: totalAmount * 100,
  }
}