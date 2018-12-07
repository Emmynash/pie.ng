import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import reducers from './reducers'
import history from './history'
import config from '../../config/config.client'

const middlewares = [thunk, routerMiddleware(history)]
if (config.env === 'development') {
  const { logger } = require('redux-logger')
  middlewares.push(logger)
}

export function configureStore(initialState = {}) {
  // Middleware and store enhancers
  const enhancers = [applyMiddleware(...middlewares)]

  const store = createStore(reducers, initialState, compose(...enhancers))
  
  return store
}