/* global process */
import { createStore, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { ENV_DEV } from '../constants'
import translationApp from '../reducers/reducers'

const logger = createLogger({
    collapsed: true
})

const createStoreWithMiddleware = (process.env.NODE_ENV === ENV_DEV) ? applyMiddleware(
    logger,
    thunk
)(createStore) : applyMiddleware(thunk)(createStore)

export default function configureStore() {
    return createStoreWithMiddleware(translationApp)
}