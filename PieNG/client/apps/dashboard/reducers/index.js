import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import authReducer from './auth'
import suReducer from './sign-up'
import bsReducer from './business'
import chReducer from './charge'
import { isWorking, pageName } from './common'
import summary from './summary'

export default combineReducers({
  suReducer,
  authReducer,
  bsReducer,
  chReducer,
  isWorking,
  pageName,
  form: formReducer,
  routing: routerReducer,
  summary: summary
})

// State readers
export const getIsWorking = (state) => (state.isWorking)
export const getPageName = (state) => (state.pageName)