import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { fetchInfo, setTitle } from '../actions'
import { getPageName } from '../reducers'
import { getDefaultAccount } from '../../../utils/user'
import { objKeys } from '../../../utils/_'

class Settings extends Component {
  
  static propTypes = {
    fetchInfo: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired,
    pageName: PropTypes.string.isRequired
  }
  
  constructor(props) {
    super(props)
  }
  
  componentDidMount() {
    this.props.fetchInfo(getDefaultAccount().id)
  }
  
  render() {
    const { store } = this.props
    const { accountInfo } = store.authReducer
    return (
      <div className="container">
      <div className="row">
        <Helmet title={this.props.pageName} />
        {objKeys(accountInfo).map(key => {
        console.log(key)
        if(key === 'user') return <AccountInfo accountInfo={accountInfo[key]} />
        if(key === 'businesses') return <BusinessesInfo info={accountInfo[key]} />
        if(key === 'wallets') return <WalletInfo wallets={accountInfo[key]} />
        if(key === 'business') return <BusinessInfo accountInfo={accountInfo[key]} />
        })}
      </div>
      <div className="row">
        <ChangePassword />
      </div>
    </div>
    )
  }
}

const AccountInfo = ({ accountInfo }) => (
  <div className="col-md-12 col-lg-4 col-xl-4">
    <div className="card m-b-20">
      <div className="card-block" style={{ height: '260px' }}>
        <h4 className="mt-0 header-title">Account Information</h4>
        <p className="text-muted m-b-30 font-14"></p>
        <form onSubmit={(e) => {}}>
          <div className="form-group">
            <label htmlFor="targetWalletPhone">Account Name</label>
            <input type="text" className="form-control" id="targetWalletPhone" name="name" value={accountInfo.name} disabled={true} />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Phone Number</label>
            <input type="text" className="form-control" id="phone" name="phone" value={accountInfo.phone} disabled={true} />
          </div>
        </form>
      </div>
    </div>
  </div>
)

const BusinessesInfo = ({ info }) => (
  <div className="col-md-12 col-lg-4 col-xl-4">
    <div className="card m-b-20">
      <div className="card-block" style={{ height: '260px' }}>
        <h4 className="mt-0 header-title">Associated Businesses</h4>
        {!info.length && <div>
          <p className="text-muted m-b-30 font-14">You have not created any businesses yet!</p>
          <div className="form-group row m-t-20">
            <div className="col-sm-12 text-center">
              <Link to="/dashboard/business/create" className="btn btn-primary waves-effect waves-light">Create Business</Link>
            </div>
          </div>
        </div>}
        {!!info.length && <form onSubmit={(e) => {}}>
          <div className="form-group">
            <label htmlFor="targetWalletPhone">Business Name</label>
            <input type="text" className="form-control" id="targetWalletPhone" name="name" value={info.name} disabled={true} />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount (Naira)</label>
            <input type="text" className="form-control" id="phone" name="phone" value={info.phone} disabled={true} />
          </div>
        </form>}
      </div>
    </div>
  </div>
)

const WalletInfo = ({ wallets }) => (
  <div className="col-md-12 col-lg-4 col-xl-4">
    <div className="card m-b-20">
      <div className="card-block" style={{ height: '260px' }}>
        <h4 className="mt-0 header-title">Wallets</h4>
        <p className="text-muted m-b-30 font-14"></p>
        <form onSubmit={(e) => {}}>
          {wallets.map(wallet => (<div className="form-group" key={wallet.id}>
            <label htmlFor="targetWalletPhone">Wallet Name</label>
            <input type="text" className="form-control" id="targetWalletPhone" name="name" value={wallet.tag} disabled={true} />
          </div>))}
        </form>
      </div>
    </div>
  </div>
)


let visibility = false, maskedText = '•••••••••••••••••••', maskText = maskedText

const toggleSecretVisibility = (e, value) => {
  if(!visibility) { 
    maskText = value
    visibility = true
  } else {
    maskText = maskedText
    visibility = false
  }
  console.log(maskText, value)
}

const BusinessInfo = ({ accountInfo }) => (
  <div className="col-md-12 col-lg-6 col-xl-6">
    <div className="card m-b-20">
      <div className="card-block" style={{ height: '520px' }}>
        <h4 className="mt-0 header-title">Account Information</h4>
        <p className="text-muted m-b-30 font-14"></p>
        <form onSubmit={(e) => {}}>
          <div className="form-group">
            <label htmlFor="targetWalletPhone">Account Name</label>
            <input type="text" className="form-control" id="targetWalletPhone" name="name" value={accountInfo.name} disabled={true} />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Phone Number</label>
            <input type="text" className="form-control" id="phone" name="phone" value={accountInfo.phone} disabled={true} />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Public Key</label>
            <input type="text" className="form-control" id="phone" name="phone" value={accountInfo.apiKey} disabled={true} />
          </div>
          <div className="form-group">
            <label htmlFor="apiSecret">Secret Key</label>
            <div>
              <div className="input-group">
                <input type="text" className="form-control" id="apiSecret" name="apiSecret" value={accountInfo.apiSecret} disabled={true} />
                <button type="button" className="input-group-addon bg-custom b-0" onClick={e => toggleSecretVisibility(e, accountInfo.apiSecret)}><i className="mdi mdi-eye"></i></button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
)

const ChangePassword = () => (
  <div className="col-md-12 col-lg-6 col-xl-6">
    
  </div>
)

const mapStateToProps = (store) => ({
  store,
  pageName: getPageName(store)
})

const mapDispatchToProps = (dispatch) => ({
  fetchInfo: (accountId) => dispatch(fetchInfo(accountId)),
  setTitle: title => dispatch(setTitle(title))
})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)