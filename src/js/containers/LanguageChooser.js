import React, {Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
import {
    selectDomain,
    selectLanguage,
    fetchStringsIfNeeded
} from '../actions/actions'
import { languageChooserSelector } from '../selectors/selectors'
import Picker from '../components/Picker'

class LanguageChooser extends Component {
    constructor(props) {
        super(props)
        this.handleDomainChange = this.handleDomainChange.bind(this)
        this.handleLanguageChange = this.handleLanguageChange.bind(this)
    }
    
    componentDidMount() {
        const { dispatch, params } = this.props
        dispatch(selectDomain(params.domainName))
        dispatch(fetchStringsIfNeeded(params.domainName))
    }
    
    componentWillReceiveProps(nextProps) {
        const { dispatch, params: currParams } = this.props
        const nextDomain = nextProps.params.domainName
        if (nextDomain !== currParams.domainName) {
            dispatch(selectDomain(nextDomain))
            dispatch(fetchStringsIfNeeded(nextDomain))
        }
    }
    
    handleDomainChange(nextDomain) {
        this.props.dispatch(routeActions.push('/domain/'+nextDomain))
    }
    
    handleLanguageChange(nextLanguage) {
        var selectedDomain = this.props.selectedDomain
        this.props.dispatch(selectLanguage(nextLanguage))
        this.props.dispatch(routeActions.push(`/domain/${selectedDomain}/lang/${nextLanguage}`))
    }
    
    render() {
        const {
            isFetching,
            domains,
            languages,
            selectedDomain
        } = this.props
        
        return (
            <div className="row">
                
                {!isFetching.domains &&
                    <div className="col-md-2">
                        <Picker value={selectedDomain}
                                disabled={false}
                                onChange={this.handleDomainChange}
                                options={domains}
                                showEmptyOption={false}
                                title="Translation domain" />
                    </div>
                }
                
                {!isFetching.languages && 
                    <div className="col-md-3">
                        <Picker value=""
                                disabled={false}
                                onChange={this.handleLanguageChange}
                                labels={languages.map(lang => `${lang.name} (${lang.code})`)}
                                options={languages.map(lang => lang.code)}
                                showEmptyOption={true}
                                title="Language" />
                    </div>
                }
                
                <div className="col-md-12">
                    <p>Please select a language.</p>
                </div>
            </div>
        )
    }
}

LanguageChooser.propTypes = {
    domains: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    isFetching: PropTypes.shape({
        domains: PropTypes.bool.isRequired
    }).isRequired,
    languages: PropTypes.arrayOf(
        PropTypes.shape({
            code: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        }).isRequired
    ).isRequired,
    selectedDomain: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
}

export default connect(languageChooserSelector)(LanguageChooser)