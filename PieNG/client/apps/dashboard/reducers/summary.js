// import * as user from '../../../utils/user'

const initialState = {
  summary: {},
  dashboard: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
   case 'FETCH_SUMMARY_SUCCESS':
      return {
        ...state,
        summary: action.summary
      }
    case 'FETCH_SUMMARY_FAIL':
      return {
        ...state,
        summary: {},
      }
    case 'FETCH_DASHNOARD_SUCCESS':
      return {
        ...state,
        dashboard: action.dashboard
      }
    case 'FETCH_DASHNOARD_FAIL':
      return {
        ...state,
      }
    default:
      return state
  }
}