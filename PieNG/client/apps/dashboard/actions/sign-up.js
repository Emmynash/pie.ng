import * as user from '../../../utils/user'
import { isWorking, isDoneWorking } from './common'
import * as toastr from '../../../utils/toastr'

export const signupSuccess = (user) => {
  return { type: 'SIGNUP_SUCCESS', user }
}

const signupFail = error => {
  return { type: 'SIGNUP_FAILED', error }
}

const verifySuccess = error => {
  return { type: 'VERIFICATION_SUCCESS' }
}
const verifyFail = error => {
  return { type: 'VERIFICATION_FAILED', error }
}

export const signup = (newUser, history) => {
  return (dispatch) => {
    dispatch(isWorking())
    return user.signup(newUser).then((createdUser) => {
      dispatch(signupSuccess(createdUser))
      dispatch(isDoneWorking())
      history.push('/dashboard/account/verify')
      toastr.success('Okay!', 'Your account was created successfully. Verify your number')
    }).catch((error) => {
      dispatch(signupFail(error))
      dispatch(isDoneWorking())
      console.log('sign-up', error)
      toastr.error('Oops!', error)
    })
  }
}

export const verify = (verification, history) => {
  return (dispatch) => {
    dispatch(isWorking())
    return user.verifyNewUser(verification).then(() => {
      history.push('/dashboard/account/login')
      dispatch(verifySuccess())
      dispatch(isDoneWorking())
    }).catch((error) => {
      dispatch(verifyFail(error))
      dispatch(isDoneWorking())
    })
  }
}