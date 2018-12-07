import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import $ from 'jquery'
import Summary from './Summary'
import { logout, changeAccount, storeCurrentUser, toggleMode } from '../actions'
import LeftMenu from '../components/dashboard/leftMenu'
import TopBar from '../components/dashboard/topBar'
import Footer from '../components/footer'
import Loading from '../components/app/loading'
// import config from '../../../config/config.client'
import * as auth from '../../../utils/user'
import * as business from '../../../utils/business'
import CreateBusiness from './CreateBusiness'
import FundWallet from './FundWallet'
import PaymentHistory from './PaymentHistory'
import Transfer from './Transfer'
import Settings from './Settings'
import { getIsWorking, getPageName } from '../reducers'

// Images
import logo from '../../../assets/images/logo.png'

class Dashboard extends Component {
  
  static propTypes = {
    logout: PropTypes.func.isRequired,
  }
  
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  
  constructor(props, context) {
    super(props, context)
    this.logout = ::this.logout
    this.changeAccountHandler = ::this.changeAccount
  }
  
  componentDidMount() {
    $('.button-menu-mobile').on('click', e => {
      e.preventDefault()
      $('body').toggleClass('fixed-left-void')
      $('#wrapper').toggleClass('enlarged')
    })
  }
  
  logout() {
    this.props.logout()
  }
  
  changeAccount(account) {
    this.props.changeAccount(account)
  }
  
  render() {
    let user = auth.getUser(), activeAccount = auth.getDefaultAccount(), pageName = this.props.pageName
    return (
      <div>
        {activeAccount && <div>
          <LeftMenu logoSm={logo} accountType={auth.getAccountType(activeAccount.id)} currentPath={this.props.location.pathname} />
          <div className="content-page">
            <div className="content">
              {this.props.isWorking && <Loading />}
              <TopBar
                user={user}
                businesses={business.getBusinesses()}
                changeAccount={this.changeAccountHandler}
                activeAccount={activeAccount}
                logout={this.logout}
                accountType={auth.getAccountType(activeAccount.id)}
                toggleMode={() => this.props.toggleMode(activeAccount.id)}
                mode={activeAccount.livemode || false}
                pageName={pageName} />
              <div className="page-content-wrapper">
                <Route exact path={`${this.props.match.path}`} component={ Summary } />
                <Route path={`${this.props.match.path}/summary`} component={ Summary } />
                <Route path={`${this.props.match.path}/business/create`} component={ CreateBusiness } />
                <Route path={`${this.props.match.path}/fund`} component={ FundWallet } />
                <Route path={`${this.props.match.path}/payments`} component={ PaymentHistory } />
                <Route path={`${this.props.match.path}/transfer`} component={ Transfer } />
                <Route path={`${this.props.match.path}/settings`} component={ Settings } />
              </div>
            </div>
            <Footer appName={config.appName/*global config*/} />
          </div>
        </div>}
      </div>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    store: store,
    isWorking: getIsWorking(store),
    pageName: getPageName(store)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (history) => dispatch(logout(history)),
    changeAccount: (account, history) => dispatch(changeAccount(account, history)),
    storeCurrentUser: (user) => dispatch(storeCurrentUser(user)),
    toggleMode: (accountId) => dispatch(toggleMode(accountId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)