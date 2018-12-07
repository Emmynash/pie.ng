const initialState = {
  otpRequestFailed: false,
  retrying: false
}

export const otp = (state = initialState, action) => {
    switch (action.type) {
      case 'REQUESTING_OTP_RESEND':
        return {
          ...state,
          retrying: true
        }
      case 'DONE_REQUESTING_OTP_RESEND':
        return {
          ...state,
          retrying: false
        }
      case 'OTP_RESENT':
        return {
          ...state
        }
      case 'OTP_RESEND_FAIL':
        return {
          ...state,
          otpRequestFailed: true
        }
    default:
      return state
  }
}
