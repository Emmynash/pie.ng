import React from 'react'
import { render } from 'react-dom'
import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux'
import App from './containers/App'
import { configureStore } from './store'
import history from './history'
import 'jquery'
import 'bootstrap'

import '../../lib/toastr/toastr.scss'
// import 'bootstrap/dist/css/bootstrap.css'
import config from '../../config/config.client'

// const store = createStore(reducers, applyMiddleware(routerMiddleware(history)))
const store = configureStore(window.__INITIAL_STATE)

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>
, document.getElementById('wrapper'))

if(config.env === 'development' && module.hot) {
  module.hot.accept()
  module.hot.accept('./reducers', () => {
    store.replaceReducer(require('./reducers').default)
  })
}
