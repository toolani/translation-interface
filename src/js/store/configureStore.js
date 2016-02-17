/* global process */
import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { hashHistory } from 'react-router'
import { syncHistory } from 'react-router-redux'
import { ENV_DEV } from '../constants'
import reducers from '../reducers/reducers'

const logger = createLogger({
    collapsed: true
})

const reduxRouterMiddleware = syncHistory(hashHistory)

const createStoreWithMiddleware = (process.env.NODE_ENV === ENV_DEV) ? applyMiddleware(
    logger,
    thunk,
    reduxRouterMiddleware
)(createStore) : applyMiddleware(thunk, reduxRouterMiddleware)(createStore)

export default function configureStore() {
    return createStoreWithMiddleware(reducers)
}