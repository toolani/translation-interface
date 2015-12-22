import 'babel-core/polyfill'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
import App from './containers/App'

let store = configureStore()

React.render((
    <Provider store={store}>
        {() => <App />}
    </Provider>
), document.getElementById('app-container'))
