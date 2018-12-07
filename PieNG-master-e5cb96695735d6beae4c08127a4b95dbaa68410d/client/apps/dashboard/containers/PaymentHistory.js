import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import Helmet from 'react-helmet'

import { fetchPaymentHistory, setTitle } from '../actions'
import { getPageName } from '../reducers'
import { objKeys, objValues } from '../../../utils/_'

import 'react-datepicker/dist/react-datepicker.css'
import '../../../assets/plugins/RWD-Table-Patterns/dist/css/rwd-table.min.css'

class PaymentHistory extends Component {
  
  static propTypes = {
    fetchPaymentHistory: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired,
    pageName: PropTypes.string.isRequired
  }
  
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  
  constructor(props, context) {
    super(props, context)
    this.props.setTitle('Wallet History')
    this.state = {
      startDate: moment().hour(0).minute(0).second(0),
      endDate: moment().hour(23).minute(59).second(59),
      totalCredit: 1,
      totalDebit: 1
    }
  }
  
  componentDidMount() {
    this.refreshTable()
  }
  
  refreshTable() {
    this.props.fetchPaymentHistory(this.props.store.authReducer.defaultAccount.id, {
      startDate: this.state.startDate.format(),
      endDate: this.state.endDate.format(),
    })
  }
  
  setCredit(totalCredit) {
    console.log(totalCredit)
    this.setState({ totalCredit })
  }
  
  setDebit(totalDebit) {
    console.log(totalDebit)
    this.setState({ totalDebit })
  }
  
  render() {
    const cols = {
      sn: '#',
      id: 'Charge Reference',
      amountToPay: 'Amount',
      narration: 'Narration',
      paidAtDate: 'Date',
      paidAtTime: 'Time',
    }
    return (
    <div className="container">
      <Helmet title={this.props.pageName} />
      {/*<div className="row">
        <div className="col-md-6 col-lg-6 col-xl-3">
          <div className="mini-stat clearfix bg-white">
            <span className="font-40 text-indigo mr-0 float-right"><i className="ti-stats-up"></i></span>
            <div className="mini-stat-info">
              <h3 className="counter font-light mt-0">362410</h3>
            </div>
            <p className=" mb-0 m-t-10 text-muted">Total credit: ₦{this.state.totalCredit} </p>
          </div>
        </div>
        <div className="col-md-6 col-lg-6 col-xl-3">
          <div className="mini-stat clearfix bg-white">
            <span className="font-40 text-pink mr-0 float-right"><i className="ti-stats-down"></i></span>
            <div className="mini-stat-info">
              <h3 className="counter font-light mt-0">362410</h3>
            </div>
            <p className=" mb-0 m-t-10 text-muted">Total debit: ₦{this.state.totalDebit} </p>
          </div>
        </div>
      </div>*/}
      <div className="row">
        <div className="col-sm-12">
          <div className="card m-b-20">
            <div className="card-block">
              <h4 className="mt-0 header-title">Payment History</h4>
              <p className="text-muted m-b-30 font-14"></p>
              <div className="table-rep-plugin">
                <Table
                  columns={cols}
                  rows={this.props.store.chReducer.paymentHistory}
                  defaultAccount={this.props.store.authReducer.defaultAccount}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  handleStartChange={date => this.setState({ startDate: date })}
                  handleEndChange={date => this.setState({ endDate: date })}
                  refreshTable={() => this.refreshTable() }
                  setCredit={totalCredit => this.setCredit(totalCredit) }
                  setDebit={totalDebit => this.setDebit(totalDebit) } />
              </div>
            </div>
          </div>
        </div>
      </div>    
    </div>    
    )
  }
}

const Table = ({ columns, rows, defaultAccount, startDate, endDate, handleStartChange, handleEndChange, refreshTable, setCredit, setDebit }) => {
  const _head = () => {
    let cols = objValues(columns).map(colName => (
      <th key={columns._id}>{colName}</th>
    ))
    return (
      <tr>{cols}</tr>
    )
  }
  
  const _rows = () => {
    let sn = 0, totalDebit = 0, totalCredit = 0
    const _rows_ = rows.map(row => {
      if(row.amount !== 0) {
        sn++
        let values = objKeys(columns).map(colKey => {
          if(colKey === 'amountToPay') {
            var tdData = '₦' + ((row['amount']/100).toFixed(2)).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
            var wallets = []
            for (var i = 0; i < defaultAccount.wallets.length; ++i ) {
              wallets.push(defaultAccount.wallets[i].id)
            }
            if(wallets.indexOf(row.targetWalletId) > -1 || row.chargeType === 'credit') {
              tdData = `<span class="text-success">${tdData}</span>`
              totalCredit += row['amount']/100
              console.log(totalCredit)
            } else {
              tdData = `<span class="text-danger">${tdData}</span>`
              totalDebit += row['amount']/100
              console.log(totalDebit)
            }
          } else if(colKey === 'sn') {
            tdData = sn
          } else {
            tdData = row[colKey]
          }
          return (
            <td data-label={colKey} key={colKey} dangerouslySetInnerHTML={{ __html: tdData}}></td>
          )
        })
        return (
          <tr key={row._id}>{values}</tr>
        )
      }
    })
    return _rows_
  }
  
  return (
    <div className="table-wrapper">
      <div className="btn-toolbar">
        <div className="col-4">
          <div className="input-daterange input-group" id="date-range">
            <DatePicker
              selectsStart
              selected={startDate}
              onChange={handleStartChange}
              todayButton="Today"
              dateFormat="LL"
            />
            <span className="input-group-addon b-0">to</span>
            <DatePicker
              selectsEnd
              selected={endDate}
              onChange={handleEndChange}
              todayButton="Today"
              dateFormat="LL"
            />
            <button className="input-group-addon b-0 btn-primary" onClick={() => refreshTable()}>Filter</button>
          </div>
        </div>
        <div className="col-8">
        
        </div>
      </div>
      <div className="table-responsive b-0">
        <table className="responsive-table table table-hover table-striped">
          <thead>
            {_head()}
          </thead>
          <tbody>
            {_rows()}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const mapStateToProps = (store) => {
  return {
    store,
    pageName: getPageName(store)
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchPaymentHistory: (accountId, options = {}) => dispatch(fetchPaymentHistory(accountId, options)),
  setTitle: title => dispatch(setTitle(title))
})

export default connect(mapStateToProps, mapDispatchToProps)(PaymentHistory)