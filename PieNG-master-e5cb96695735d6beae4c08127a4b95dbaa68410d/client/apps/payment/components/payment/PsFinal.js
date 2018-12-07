import React from 'react'

export default ({ timeToClose, amountPaid = 0, currencySign }) => (
  <div>
    <div className="radial radial--active" style={{ height: '110px', width: '110px' }}>
      <span className="h3 radial__label">{timeToClose}</span>
    </div>
    <div className="alert bg--success">
      <div className="alert__body text-center">
        <span>{currencySign}{(amountPaid/100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')} PAYMENT SUCCESSFUL</span>
      </div>
    </div>
  </div>
)