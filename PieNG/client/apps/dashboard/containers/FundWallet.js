import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import formSerializer from 'form-serialize'
import * as auth from '../../../utils/user'
import * as toastr from '../../../utils/toastr'

import { fetchWallets, setTitle, submitFunding } from '../actions'
import { getPageName } from '../reducers'

import './Business/createBusiness.scss'

class FundWallet extends Component {
  
    static propTypes = {
        fetchWallets: PropTypes.func.isRequired,
        submitPayment: PropTypes.func.isRequired,
        setTitle: PropTypes.func
    }
  
    constructor(props, context) {
        super(props, context)
        this.props.setTitle('Wallets')
    }
  
    componentDidMount() {
        this.props.fetchWallets(this.props.store.authReducer.defaultAccount.id)
    }
    
    submitPayment(formData) {
        this.props.submitPayment(formData.trxref)
    }
    
    submitPaymentFail() {
        toastr.error('Snap!', 'An error and your wallet could not be funded')
    }
  
    fundWallet(e) {
        e.preventDefault()
        const formData = formSerializer(e.target, { hash: true })
        formData.customer = formData.customer
        // formData.amount = Number(formData.amount)
        const PBFKey = 'FLWPUBK-3dd80bf674c5f5c16f8cbb37992cb074-X'
        window.getpaidSetup({
            PBFPubKey: PBFKey,
            customer_email: `${formData.customer}@pie.ng`,
            customer_firstname: formData.name.split(' ')[0],
            customer_lastname: formData.name.split(' ')[1] || formData.name.split(' ')[0],
            custom_description: 'Fund Pie Wallet',
            custom_logo: 'https://pie.ng/static/img/logo.png',
            custom_title: 'Pie.NG',
            // amount:  5000,
            customer_phone: formData.phone,
            country: 'NG',
            currency: formData.currency,
            payment_method: 'both',
            txref: `${formData.customer}`,
            //integrity_hash: '<ADD YOUR INTEGRITY HASH HERE>',
            onclose: function() {},
            callback: function(response) {
                var flwRef = response.tx.flwRef
                console.log('This is the response returned after a charge', response)
                if (response.tx.chargeResponseCode === '00' || response.tx.chargeResponseCode === '0') {
                    formData.trxref = flwRef
                    this.submitPayment(formData)
                    return false
                } else {
                    this.submitPaymentFail()
                    return false
                }
            }
        })
    }

    render() {
        let { store } = this.props
        let { wallets } = store.authReducer
        let user = auth.getUser()
        return (
        <div className="container">
            <div className="row">
                <Helmet title={this.props.pageName} />
                {wallets.map(wallet => (<div className="col-md-4 col-sm-6 col-12" key={wallet.id}>
                    <div className="card m-b-20">
                      <div className="card-block">
                        <h4 className="card-title font-20 mt-0">{wallet.tag.toUpperCase()} [{wallet.currency}]</h4>
                      </div>
                      <div className="card-block mt-0 pt-0">
                        <p className="mb-0 m-t-10 text-muted">Previous Balance: <span className="pull-right">{wallet.currency}{wallet.previousBalance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</span></p>
                        <p className="mb-0 m-t-10 text-muted">Current Balance: <span className="pull-right">{wallet.currency}{wallet.currentBalance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</span></p>
                      </div>
                      <div className="card-block">
                        <form onSubmit={(e) => this.fundWallet(e)}>
                            <input type="hidden" value={wallet.currency} name="currency" />
                            <input type="hidden" value={wallet.customer} name={user.id} />
                            <input type="hidden" value={user.name} name="name" />
                            <input type="hidden" value={user.phone} name="phone" />
                            <input type="hidden" value={wallet.id} name="walletId" />
                            <button type="submit" className="btn btn-primary waves-effect waves-light">Fund Wallet</button>
                        </form>
                      </div>
                    </div>
                </div>))}
            </div>
        </div>
        )
    }
}

const mapStateToProps = (store) => {
    return {
        store: store,
        pageName: getPageName(store)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchWallets: data => dispatch(fetchWallets(data)),
        setTitle: title => dispatch(setTitle(title)),
        submitPayment: data => dispatch(submitFunding(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FundWallet)