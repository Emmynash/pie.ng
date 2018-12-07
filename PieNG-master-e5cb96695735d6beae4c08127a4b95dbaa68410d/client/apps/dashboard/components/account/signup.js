import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'

import './login.scss'

const renderField = ({ input, label, type, placeholder, meta: { touched, error, warning } }) => (
  <div className="form-group">
    <label htmlFor="useremail">{label}</label>
    <input {...input} type={type} className={ touched && error && 'form-control validation-error' || touched && warning && 'form-control validation-warning' || 'form-control'} placeholder={label} />
    {touched && error && <span className="validation-errors">{error}</span>}
  </div>
)

const phoneNumber = value =>
  value && !/^(0[7-9][0-1][0-9]{8})$/i.test(value)
    ? 'Invalid phone number, must be 11 digits'
    : undefined
const required = value => (value ? undefined : 'Required')
const alphaNumeric = value =>
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? 'Only alphanumeric characters'
    : undefined
export const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined
export const minLength11 = minLength(11)
export const maxLength = max => value =>
  value && value.length < max ? `Must be ${max} characters or less` : undefined
export const maxLength13 = minLength(13)
const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined

const SignUp = props => {
  const { handleRegistration } = props
  return(
    <form className="form-horizontal m-t-30" onSubmit={handleRegistration}>
      <Field
        name="name"
        type="text"
        component={renderField}
        label="Full name"
        validate={[required]} />
      <Field
        name="phone"
        type="text"
        component={renderField}
        label="Phone number"
        validate={[required, phoneNumber]} />
      <Field
        name="password"
        type="password"
        component={renderField}
        label="Password"
        validate={[required]}
        />{/*warn={alphaNumeric}*/}
      <div className="form-group row m-t-20">
        <div className="col-12 text-right">
          <button className="btn btn-primary w-md waves-effect waves-light" type="submit">Register</button>
        </div>
      </div>

		  {/*
      <div className="form-group m-t-10 mb-0 row">
        <div className="col-12 m-t-20">
          <p className="font-14 text-muted mb-0">By registering you agree to the Admiria <a href="#">Terms of Use</a></p>
        </div>
      </div>
      */}
    </form>
  )
}

export default reduxForm({
  form: 'fieldLevelValidation',
})(SignUp)
