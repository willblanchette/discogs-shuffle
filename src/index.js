import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import App from './components/App'
import reducer from './reducers'
import middleware from './middleware'

const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || React.compose;

const store = createStore(
  reducer,
  compose(middleware)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)