import React, { Component } from 'react'
import PropTypes from 'prop-types'
import formSerializer from 'form-serialize'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { createBusiness } from '../actions'
import { concat } from '../../../utils/_'

import Step1 from '../components/dashboard/business/cbStep1'
import Step2 from '../components/dashboard/business/cbStep2'
import Step3 from '../components/dashboard/business/cbStep3'
import Step4 from '../components/dashboard/business/cbStep4'

import './Business/createBusiness.scss'

class CreateBusiness extends Component {
  
  static propTypes = {
    createBusiness: PropTypes.func.isRequired,
  }
  
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  
  constructor(props, context) {
    super(props, context)
    this.handleNext = ::this.nextStep
    this.handlePrev = ::this.prevStep
    this.handleCreateBusiness = ::this.createBusiness
    this.state = {
      currentStep: 1,
      data: {}
    }
  }
  
  nextStep(e) {
    e.preventDefault()
    const formData = formSerializer(this.form, { hash: true })
    this._saveDate(formData)
    this.setState({ currentStep: this.state.currentStep + 1 })
  }
  
  prevStep(e) {
    e.preventDefault()
    this.setState({ currentStep: this.state.currentStep - 1 })
  }
  
  _saveDate(data) {
    console.log(this.state.data)
    data = concat({}, this.state.data, data)
    this.setState({ data })
  }
  
  createBusiness(e) {
    e.preventDefault()
    this.props.createBusiness(this.state.data, this.context.router.history)
  }
  
  className(check, cn = '') {
    if(this.state.currentStep === check) {
      return cn + ' current'
    }
    return cn + ' disabled'
  }
  
  render() {
    return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <div className="card m-b-20">
            <div className="card-block">
              <h4 className="mt-0 header-title">Create a New Business</h4>
              <p className="text-muted m-b-30 font-14">Power your business with our remarkable payment system built for your kind of business</p>
              <form id="form-horizontal" className="form-horizontal form-wizard-wrapper wizard clearfix" ref={form => this.form = form}>
                <div className="steps clearfix">
                  <ul role="tablist">
                    <li role="tab" className={this.className(1, 'first')} aria-disabled="false" aria-selected="true">
                      <a id="form-horizontal-t-0" href="#form-horizontal-h-0" aria-controls="form-horizontal-p-0">
                        <span className="current-info audible">current step: </span>
                        <span className="number">1.</span> Business
                      </a>
                    </li>
                    <li role="tab" className={this.className(2, 'second')} aria-disabled="true">
                      <a id="form-horizontal-t-1" href="#form-horizontal-h-1" aria-controls="form-horizontal-p-1">
                        <span className="number">2.</span> Bank
                      </a>
                    </li>
                    <li role="tab" className={this.className(3, 'third')} aria-disabled="true">
                      <a id="form-horizontal-t-2" href="#form-horizontal-h-2" aria-controls="form-horizontal-p-2">
                        <span className="number">3.</span> Confirm
                      </a>
                    </li>
                    <li role="tab" className={this.className(4, 'last')} aria-disabled="true">
                      <a id="form-horizontal-t-3" href="#form-horizontal-h-3" aria-controls="form-horizontal-p-3">
                        <span className="number">4.</span> Good News
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="content clearfix" style={{ paddingTop: '20px', minHeight: '300px' }}>
                  {this.state.currentStep === 1 && <Step1 data={this.state.data} />}
                  {this.state.currentStep === 2 && <Step2 data={this.state.data} />}
                  {this.state.currentStep === 3 && <Step3 data={this.state.data} />}
                  {this.state.currentStep === 4 && <Step4 data={this.state.data} />}
                </div>
                <div className="actions clearfix">
                  <ul role="menu" aria-label="Pagination">
                    {this.state.currentStep > 1 && 
                    <li aria-disabled="false">
                      <a href="#previous" onClick={this.handlePrev} role="menuitem">Previous</a>
                    </li>}
                    {this.state.currentStep < 3 &&
                    <li aria-hidden="false" aria-disabled="false">
                      <a href="#next" onClick={this.handleNext} role="menuitem">Next</a>
                    </li>}
                    {this.state.currentStep === 3 &&
                    <li aria-hidden="true">
                      <a href="#finish" onClick={this.handleCreateBusiness} role="menuitem">Finish</a>
                    </li>}
                    {this.state.currentStep === 4 &&
                    <li aria-hidden="true">
                      <Link to="/dashboard/summary" role="menuitem">Close</Link>
                    </li>}
                  </ul>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>    
    </div>    
    )
  }
}

const mapStateToProps = (state) => {
  return { res: state }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createBusiness: (data, history) => dispatch(createBusiness(data, history))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBusiness)