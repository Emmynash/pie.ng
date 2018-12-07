import * as business from '../../../utils/business'
// import config from '../../../config/config.client'
import * as toastr from '../../../utils/toastr'
import { isWorking, isDoneWorking } from './common'


export const createBusinessSuccess = (business) => ({
  type: 'BUSINESS_CREATED', business
})

const createBusinessFail = error => ({
  type: 'BUSINESS_CREATION_FAILED', error
})

const toggleModeSuccess = response => ({
  type: 'ACCOUNT_MODE_SWITCHED'
})

const toggleModeFail = error => ({
  type: 'ACCOUNT_MODE_SWITCH_FAIL', error
})

export const createBusiness = (data, history) => {
  return (dispatch) => {
    dispatch(isWorking())
    return business.createBusiness(data).then((response) => {
      dispatch(createBusinessSuccess(response))
      dispatch(isDoneWorking())
      toastr.success('Success', 'Business created successfully')
      window.location.assign(config.appUrl.concat('/dashboard'))/*global config*/
    }).catch(error => {
      dispatch(createBusinessFail(error))
      toastr.error('Oops', error.message)
      dispatch(isDoneWorking())
    })
  }
}

export const toggleMode = accountId => {
  return dispatch => {
    dispatch(isWorking())
    return business.toggleMode(accountId).then(response => {
      dispatch(toggleModeSuccess(response))
      dispatch(isDoneWorking())
      toastr.success('Success', 'Mode switched successfully')
      window.location.assign(config.appUrl.concat('/dashboard'))
    }).catch(error => {
      dispatch(toggleModeFail(error))
      toastr.error('Oops!', error.message || error)
      dispatch(isDoneWorking())
    })
  }
}