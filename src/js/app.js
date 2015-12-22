import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
import App from './containers/App'

let store = configureStore()

ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('app-container'))
