import { getSummary } from '../../../utils'
import * as toastr from '../../../utils/toastr'
import { isWorking, isDoneWorking } from './common'

export const fetchSummarySuccess = (summary) => {
  return { type: 'FETCH_SUMMARY_SUCCESS', summary }
}

const fetchSummaryFail = (error) => {
  return { type: 'FETCH_SUMMARY_FAIL', error }
}

export const fetchSummary = (time = 'TODAY') => {
  return (dispatch) => {
    dispatch(isWorking())
    return getSummary().then(summary => {
      console.log('summary', summary)
      dispatch(fetchSummarySuccess(summary))
      dispatch(isDoneWorking())
    }).catch(error => {
      console.error(error)
      dispatch(fetchSummaryFail(error))
      dispatch(isDoneWorking())
      toastr.error('Snap!', error)
    })
  }
}