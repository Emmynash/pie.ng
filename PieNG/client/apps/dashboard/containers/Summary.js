import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { fetchDashboard, fetchSummary, setTitle } from '../actions'
import { getPageName } from '../reducers'

class Summary extends Component {
  
  static propTypes = {
    fetchDashboard: PropTypes.func.isRequired,
    fetchSummary: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired,
    pageName: PropTypes.string.isRequired
  }
  
  constructor(props) {
    super(props)
    this.props.setTitle('Account Summary')
  }
  
  componentDidMount() {
    this.props.fetchDashboard(this.props.store.authReducer.defaultAccount.id)
  }
  
  render() {
    const { summary } = this.props
    const dashboard = summary.dashboard
    return (
      <div className="container">
      <div className="row">
        <Helmet
          title={this.props.pageName} />
        {dashboard.wallets && !!dashboard.wallets.length && <div className="col-md-6 col-lg-6 col-xl-3">
          <div className="mini-stat clearfix bg-white">
            <span className="mini-stat-icon bg-purple mr-0 float-right"><i className="mdi mdi-wallet"></i></span>
            <div className="mini-stat-info">
              <span className="counter text-purple">₦{(dashboard.wallets[0].currentBalance/100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</span>
              Current Balance
            </div>
            <div className="clearfix"></div>
            <p className=" mb-0 m-t-20 text-muted">
              Prev Bal: ₦{(dashboard.wallets[0].previousBalance/100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
              <span className="pull-right"><i className={`fa ${ (dashboard.wallets[0].currentBalance > dashboard.wallets[0].previousBalance) ? 'fa-caret-up' : (dashboard.wallets[0].currentBalance === dashboard.wallets[0].previousBalance) ? ''  : 'fa-caret-down'} m-r-5`}></i> </span>
            </p>
          </div>
        </div>}
        {dashboard.history && <div className="col-md-6 col-lg-6 col-xl-3">
          <div className="mini-stat clearfix bg-white">
            <span className="mini-stat-icon bg-blue-grey mr-0 float-right"><i className="mdi mdi-chart-line"></i></span>
            <div className="mini-stat-info">
              <span className="counter text-blue-grey">₦{(dashboard.history.todayEarnings).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</span>
              Earnings Today 
            </div>
            <div className="clearfix"></div>
            <p className=" mb-0 m-t-20 text-muted">
              Yesterday: ₦{(dashboard.history.yesterdayEarnings).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}
              <span className="pull-right">
                <i className={`fa ${ (dashboard.history.todayEarnings > dashboard.history.yesterdayEarnings) ? 'fa-caret-up' : (dashboard.history.todayEarnings === dashboard.history.yesterdayEarnings) ? ''  : 'fa-caret-down'} m-r-5`}></i>
              </span>
            </p>
          </div>
        </div>}
      </div>
    </div>
    )
  }
}

const mapStateToProps = (store) => ({
  store,
  summary: store.summary,
  pageName: getPageName(store)
})

const mapDispatchToProps = (dispatch) => ({
  fetchSummary: () => dispatch(fetchSummary()),
  fetchDashboard: (accountId) => dispatch(fetchDashboard(accountId)),
  setTitle: title => dispatch(setTitle(title))
})

export default connect(mapStateToProps, mapDispatchToProps)(Summary)