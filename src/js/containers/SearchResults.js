import React, {Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
import {
    fetchSearchResultsIfNeeded
} from '../actions/actions'
import { searchResultsContainerSelector } from '../selectors/selectors'
import SearchResult from '../components/SearchResult'

class SearchResults extends Component {
    constructor(props) {
        super(props)
        this.handleTranslationSelect = this.handleTranslationSelect.bind(this)
        this.handlePerformSearch = this.handlePerformSearch.bind(this)
    }
    
    componentDidMount() {
        const { dispatch, params } = this.props
        dispatch(fetchSearchResultsIfNeeded(params.searchTerm))
    }
    
    componentWillReceiveProps(nextProps) {
        const { dispatch, params } = this.props
        const nextSearchTerm = nextProps.params.searchTerm
        
        if (params.searchTerm !== nextSearchTerm) {
            dispatch(fetchSearchResultsIfNeeded(nextSearchTerm))
        }
    }
    
    handleTranslationSelect(domainName, stringName, languageCode) {
        const url = `/domain/${domainName}/lang/${languageCode}/filter/${stringName}`
        this.props.dispatch(routeActions.push(url))
    }
    
    handlePerformSearch(e) {
        e.preventDefault()
        const newTerm = this._searchInput.value
        const url = `/search/${newTerm}`
        this.props.dispatch(routeActions.push(url))
    }
    
    render() {
        const {
            isFetching,
            results,
            term
        } = this.props
        
        return (
            <div className="row">
                <div className="col-md-8">
                {!isFetching.searchResults &&
                    <p>Found {results.length} results from all translation domains for "{term}".</p>
                }
                    
                {!isFetching.searchResults && !!results.length &&
                    <p>Click on any result below to go to the page for that string.</p>
                }
                </div>
                
                <div className="col-md-4">
                    <form onSubmit={this.handlePerformSearch}>
                        <div className="form-group">
                            <label htmlFor="string-filter">Search again</label>
                            <div className="input-group">
                                <input className="form-control"
                                       ref={(input) => this._searchInput = input}
                                       placeholder="Enter search text"
                                       type="text"
                                       defaultValue={term}/>
                                <div className="input-group-btn">
                                    <button className="btn btn-default">Search</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                
                {isFetching.searchResults &&
                    <div className="col-md-12">
                        <p>Searching for "{term}"...</p>
                    </div>
                }
                
                {!isFetching.searchResults && !!results.length &&
                    <div className="col-md-12">
                        {results.map((result, index) => 
                            <SearchResult {...result}
                                          key={index}
                                          onSelect={this.handleTranslationSelect} />
                        )}
                    </div>
                }
            </div>
        )
    }
}

SearchResults.propTypes = {
    results: PropTypes.arrayOf(
        PropTypes.shape({
            domainName: PropTypes.string.isRequired,
            stringName: PropTypes.string.isRequired,
            languageCode: PropTypes.string.isRequired,
            translationContent: PropTypes.string.isRequired
        }).isRequired
    ).isRequired,
    term: PropTypes.string.isRequired,
    isFetching: PropTypes.shape({
        searchResults: PropTypes.bool.isRequired
    }).isRequired,
    dispatch: PropTypes.func.isRequired
}

export default connect(searchResultsContainerSelector)(SearchResults)