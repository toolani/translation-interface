import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
import {
    fetchDomains,
    fetchLanguages
} from '../actions/actions'
import { appSelector } from '../selectors/selectors'

class App extends Component {
    constructor(props) {
        super(props)
        this.handlePerformSearch = this.handlePerformSearch.bind(this)
    }
    
    componentDidMount() {
        const { dispatch } = this.props
        dispatch(fetchDomains())
        dispatch(fetchLanguages())
    }
    
    handlePerformSearch(e) {
        e.preventDefault()
        const searchTerm = this._navSearchInput.value
        const url = `/search/${searchTerm}`
        this.props.dispatch(routeActions.push(url))
    }
    
    render() {
        const {
            errors
        } = this.props
        
        return (
            <div>
                <nav className="navbar navbar-default navbar-static-top">
                    <div className="container">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="/">Translation Manager</a>
                        </div>
                        
                        <form className="navbar-form navbar-right col-md-4"
                              onSubmit={this.handlePerformSearch}>
                            <div className="form-group">
                                <div className="input-group">
                                    <input type="text"
                                           className="form-control"
                                           placeholder="Enter text to search for"
                                           ref={(input) => this._navSearchInput = input} />
                                    <div className="input-group-btn">
                                        <button className="btn btn-default">Search</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </nav>
                
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
            </div>
        )
    }
}

App.propTypes = {
    errors: PropTypes.arrayOf(PropTypes.instanceOf(Error)).isRequired,
    dispatch: PropTypes.func.isRequired
}

export default connect(appSelector)(App)