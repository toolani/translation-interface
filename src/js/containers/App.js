import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
    fetchDomains,
    fetchLanguages
} from '../actions/actions'
import { appSelector } from '../selectors/selectors'

class App extends Component {
    constructor(props) {
        super(props)
    }
    
    componentDidMount() {
        const { dispatch } = this.props
        dispatch(fetchDomains())
        dispatch(fetchLanguages())
    }
    
    render() {
        const {
            errors
        } = this.props
        
        return (
            <div className="container">
                <div className="row">
                
                {!!errors.length && 
                    <div className="col-md-12">
                        {errors.map(e => <div className="alert alert-danger">{e.message}</div>)}
                    </div>
                }
                
                </div>
                
                {this.props.children}
            </div>
        )
    }
}

App.propTypes = {
    errors: PropTypes.arrayOf(PropTypes.instanceOf(Error)).isRequired,
    dispatch: PropTypes.func.isRequired
}

export default connect(appSelector)(App)