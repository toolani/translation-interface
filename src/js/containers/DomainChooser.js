import React, {Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
import { domainChooserSelector } from '../selectors/selectors'
import Picker from '../components/Picker'

class DomainChooser extends Component {
    constructor(props) {
        super(props)
        this.handleDomainChange = this.handleDomainChange.bind(this)
    }
    
    handleDomainChange(nextDomain) {
        this.props.dispatch(routeActions.push('/domain/'+nextDomain))
    }
    
    render() {
        const {
            isFetching,
            domains
        } = this.props
        
        return (
            <div className="row">
                
                {!isFetching.domains &&
                    <div className="col-md-2">
                        <Picker value=""
                                disabled={false}
                                onChange={this.handleDomainChange}
                                options={domains}
                                showEmptyOption={true}
                                title="Translation domain" />
                    </div>
                }
                
                <div className="col-md-12">
                    <p>Please select a translation domain and a language.</p>
                </div>
            </div>
        )
    }
}

DomainChooser.propTypes = {
    domains: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    isFetching: PropTypes.shape({
        domains: PropTypes.bool.isRequired
    }).isRequired,
    dispatch: PropTypes.func.isRequired
}

export default connect(domainChooserSelector)(DomainChooser)