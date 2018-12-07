import React from 'react'
import { Field, reduxForm } from 'redux-form'

const renderField = ({ input, label, type, placeholder, meta: { touched, error, warning } }) => (
  <div className="form-group">
    <label htmlFor="useremail">{label}</label>
    <input {...input} type={type} className={ ((touched && error) && 'form-control validation-error text-center') || ((touched && warning) && 'form-control validation-warning text-center') || 'form-control text-center'} placeholder={label} />
    {touched && error && <span className="validation-errors">{error}</span>}
  </div>
)
const required = value => (value ? undefined : 'Required')
const exact = len => value => 
  value && value.length !== len ? `Verification must be ${len} characters in length` : undefined
const exact6 = exact(6)

const VerifyForm = props => {
  const { handleVerification, phoneToVerify } = props
  return(
    <form className="form-horizontal m-t-30" onSubmit={handleVerification}>
      <input type="hidden" value={phoneToVerify} name="phoneToVerify" />
      <Field
        name="verifyCode"
        type="text"
        component={renderField}
        label={'Verification Code Sent to ' + phoneToVerify}
        validate={[required, exact6]}
      />
      <div className="form-group row m-t-20">
        <div className="col-12 text-right">
          <button className="btn btn-primary w-md waves-effect waves-light" type="submit">Verify Number</button>
        </div>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'fieldLevelValidation',
})(VerifyForm)
