import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Payment from '../components/payment'

export default () => (
  <Switch>
    <Route path="/payment" component={Payment} />
  </Switch>
)