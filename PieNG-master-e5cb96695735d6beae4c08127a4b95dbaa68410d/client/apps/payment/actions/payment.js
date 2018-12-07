import * as payment from '../utils'

const otpResendSuccess = (business) => ({
  type: 'OTP_RESENT', business
})

const otpResendFail = error => ({
  type: 'OTP_RESEND_FAIL', error
})

const requestingOtpResend = () => ({
  type: 'REQUESTING_OTP_RESEND'
})

const doneRequestingOtpResend = () => ({
  type: 'DONE_REQUESTING_OTP_RESEND'
})

export const otpResend = transactionId => {
  return (dispatch) => {
    dispatch(requestingOtpResend())
    return payment.retryOtp(transactionId).then(response => {
      dispatch(doneRequestingOtpResend())
      dispatch(otpResendSuccess(response))
    }).catch(error => {
      dispatch(doneRequestingOtpResend())
      dispatch(otpResendFail(error))
    })
  }
}