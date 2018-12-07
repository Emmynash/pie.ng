import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Link } from 'react-router-dom'

const renderField = ({ input, label, type, placeholder, meta: { touched, error, warning } }) => (
  <div className="form-group">
    <label htmlFor="useremail">{label}</label>
    <input {...input} type={type} className={ touched && error && 'form-control validation-error' || touched && warning && 'form-control validation-warning' || 'form-control'} placeholder={label} />
    {touched && error && <span className="validation-errors">{error}</span>}
  </div>
)
const required = value => (value ? undefined : 'Required')
// const phoneNumber = value =>
//   value && !/^(0[7-9][0-1][0-9]{8})$/i.test(value)
//     ? 'Invalid phone number, must be 11 digits'
//     : undefined

const VerifyForm = props => {
  const { handleLogin } = props
  return(
    <form className="form-horizontal m-t-30" onSubmit={handleLogin}>
      <Field
        name="login"
        type="text"
        component={renderField}
        label="Phone Number"
      />
      <Field
        name="password"
        type="password"
        component={renderField}
        label="Password"
      />
      <div className="form-group row m-t-20">
        <div className="col-sm-6">
		    </div>
	      <div className="col-sm-6 text-right">
	         <button className="btn btn-primary w-md waves-effect waves-light" type="submit">Log In</button>
	      </div>
		  </div>
		  <div className="form-group m-t-10 mb-0 row">
		  </div>
    </form>
  )
}

export default reduxForm({
  form: 'fieldLevelValidation',
})(VerifyForm)
