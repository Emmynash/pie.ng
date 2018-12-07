import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { otp } from './payment';

export default combineReducers({
  otp,
  routing: routerReducer
});
