import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import configureStore from './store/configureStore'
import App from './containers/App'
import DomainChooser from './containers/DomainChooser'
import LanguageChooser from './containers/LanguageChooser'
import StringEditor from './containers/StringEditor'

let store = configureStore()

ReactDOM.render((
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={DomainChooser} />
                <Route path="domain/:domainName" component={LanguageChooser} />
                <Route path="domain/:domainName/lang/:languageCode" component={StringEditor} />
                <Route path="domain/:domainName/lang/:languageCode/filter/:filter" component={StringEditor} />
            </Route>
        </Router>
    </Provider>
), document.getElementById('app-container'))
