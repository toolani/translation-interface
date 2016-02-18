import React, {Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
import {
    selectDomain,
    selectLanguage,
    fetchStringsIfNeeded,
    selectStringByName,
    clearSelectedString,
    editSelectedString,
    saveSelectedString,
    startAddingNewString,
    clearNewString,
    editNewStringName,
    editNewStringContent,
    saveNewString,
    clearFilterText,
    editFilterText
} from '../actions/actions'
import { stringEditorSelector } from '../selectors/selectors'
import Picker from '../components/Picker'
import StringAdder from '../components/StringAdder'
import StringList from '../components/StringList'

class LanguageChooser extends Component {
    constructor(props) {
        super(props)
        this.handleDomainChange = this.handleDomainChange.bind(this)
        this.handleLanguageChange = this.handleLanguageChange.bind(this)
        this.handleNewStringEditStart = this.handleNewStringEditStart.bind(this)
        this.handleNewStringEditCancel = this.handleNewStringEditCancel.bind(this)
        this.handleNewStringChange = this.handleNewStringChange.bind(this)
        this.handleNewStringSave = this.handleNewStringSave.bind(this)
        this.handleStringSelection = this.handleStringSelection.bind(this)
        this.handleCancelStringSelection = this.handleCancelStringSelection.bind(this)
        this.handleSelectedStringChange = this.handleSelectedStringChange.bind(this)
        this.handleSelectedStringSave = this.handleSelectedStringSave.bind(this)
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this)
        this.handleFilterTextClear = this.handleFilterTextClear.bind(this)
        this.handlePerformSearch = this.handlePerformSearch.bind(this)
    }
    
    componentDidMount() {
        const { dispatch, params } = this.props
        const {
            domainName,
            languageCode,
            filter: filterText
        } = params
        
        dispatch(selectDomain(domainName))
        dispatch(selectLanguage(languageCode))
        dispatch(fetchStringsIfNeeded(domainName))
        
        if (typeof filterText !== 'undefined') {
            dispatch(editFilterText(filterText))
        } else {
            dispatch(editFilterText(''))
        }
    }
    
    componentWillReceiveProps(nextProps) {
        const { dispatch, params: currParams } = this.props
        const {
            domainName: nextDomain,
            languageCode: nextLanguage,
            filter: nextFilterText
        } = nextProps.params
        
        if (nextDomain !== currParams.domainName) {
            dispatch(selectDomain(nextDomain))
            dispatch(fetchStringsIfNeeded(nextDomain))
        }
        
        if (nextLanguage !== currParams.languageCode) {
            dispatch(selectLanguage(nextLanguage))
        }
        
        if (nextFilterText !== currParams.filter) {
            if (typeof nextFilterText === 'undefined') {
                dispatch(editFilterText(''))
            } else {
                dispatch(editFilterText(nextFilterText))
            }
        }
    }
    
    handleDomainChange(nextDomain) {
        const { languageCode, filter } = this.props.params
        
        if (filter) {
            this.props.dispatch(routeActions.push(`/domain/${nextDomain}/lang/${languageCode}/filter/${filter}`))
        } else {
            this.props.dispatch(routeActions.push(`/domain/${nextDomain}/lang/${languageCode}`))
        }
    }
    
    handleLanguageChange(nextLanguage) {
        const { dispatch, selectedDomain, filterText } = this.props
        if (filterText) {
            dispatch(routeActions.push(`/domain/${selectedDomain}/lang/${nextLanguage}/filter/${filterText}`))
        } else {
            dispatch(routeActions.push(`/domain/${selectedDomain}/lang/${nextLanguage}`))
        }
    }
    
    handleNewStringEditStart() {
        this.props.dispatch(startAddingNewString())
    }
    
    handleNewStringEditCancel() {
        this.props.dispatch(clearNewString())
    }
    
    handleNewStringChange(field, value) {
        switch (field) {
        case 'content':
            this.props.dispatch(editNewStringContent(value))
            break
        case 'name':
            this.props.dispatch(editNewStringName(value))
            break
        }
    }
    
    handleNewStringSave() {
        this.props.dispatch(saveNewString())
    }
    
    handleStringSelection(nextString) {
        this.props.dispatch(selectStringByName(nextString))
    }
    
    handleCancelStringSelection() {
        this.props.dispatch(clearSelectedString())
    }
    
    handleSelectedStringChange(nextContent) {
        this.props.dispatch(editSelectedString(nextContent))
    }
    
    handleSelectedStringSave() {
        this.props.dispatch(saveSelectedString())
    }
    
    handleFilterTextChange(e) {
        const { dispatch, selectedDomain, selectedLanguage } = this.props
        const url = e.target.value.length
            ? `/domain/${selectedDomain}/lang/${selectedLanguage}/filter/${e.target.value}`
            : `/domain/${selectedDomain}/lang/${selectedLanguage}`
        
        dispatch(routeActions.replace(url))
    }
    
    handlePerformSearch(e) {
        e.preventDefault()
        const { dispatch, filterText } = this.props
        const url = `/search/${filterText}`
        dispatch(routeActions.push(url))
    }
    
    handleFilterTextClear() {
        this.props.dispatch(clearFilterText())
    }
    
    render() {
        const {
            selectedDomain,
            domains,
            filterText,
            selectedLanguage,
            languages,
            newString,
            selectedString,
            strings,
            isFetching
        } = this.props
        const isFiltered = !!filterText.length
        
        return (
            <div>
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
                            <Picker value={selectedLanguage}
                                    disabled={false}
                                    onChange={this.handleLanguageChange}
                                    labels={languages.map(lang => `${lang.name} (${lang.code})`)}
                                    options={languages.map(lang => lang.code)}
                                    showEmptyOption={false}
                                    title="Language" />
                        </div>
                    }
                    
                    {!isFetching.strings &&
                        <div className="col-md-4">
                            <form onSubmit={this.handlePerformSearch}>
                                <div className="form-group">
                                    <label htmlFor="string-filter">Filter - click Search to search all domains</label>
                                    <div className="input-group">
                                        <input className="form-control"
                                               id="string-filter"
                                               onChange={this.handleFilterTextChange}
                                               placeholder="Type to filter list"
                                               type="text"
                                               value={filterText}/>
                                        <div className="input-group-btn">
                                            <button className="btn btn-default">Search</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    }
                </div>
                    
                {!isFetching.strings &&
                    <StringAdder name={newString.name}
                                 content={newString.content}
                                 error={newString.error}
                                 isEditing={newString.isEditing}
                                 isSaving={newString.isSaving}
                                 onEditStart={this.handleNewStringEditStart}
                                 onEditCancel={this.handleNewStringEditCancel}
                                 onChange={this.handleNewStringChange}
                                 onSave={this.handleNewStringSave} />
                }
                
                {isFetching.strings && strings.length === 0 &&
                    <div className="row">
                        <div className="col-md-12">
                            <p>Loading...</p>
                        </div>
                    </div>
                }
                
                {!isFetching.strings && !isFiltered && strings.length === 0  &&
                    <div className="row">
                        <div className="col-md-12">
                            <p>Translation domain is empty.</p>
                        </div>
                    </div>
                }
                
                {!isFetching.strings && isFiltered && strings.length === 0  &&
                    <div className="row">
                        <div className="col-md-12">
                            <p>No matches found for "{filterText}".</p>
                        </div>
                    </div>
                }
                
                {strings.length > 0 &&
                    <StringList strings={strings} 
                                editLanguage={selectedLanguage}
                                onSelect={this.handleStringSelection}
                                onEditCancel={this.handleCancelStringSelection}
                                onEditChange={this.handleSelectedStringChange}
                                onEditSave={this.handleSelectedStringSave}
                                onLanguageChange={this.handleLanguageChange}
                                selectedString={selectedString} />
                }
                
            </div>
        )
    }
}

LanguageChooser.propTypes = {
    domains: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    filterText: PropTypes.string.isRequired,
    isFetching: PropTypes.shape({
        domains: PropTypes.bool.isRequired,
        languages: PropTypes.bool.isRequired,
        strings: PropTypes.bool.isRequired
    }).isRequired,
    languages: PropTypes.arrayOf(
        PropTypes.shape({
            code: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        }).isRequired
    ).isRequired,
    newString: PropTypes.shape({
        name: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        error: PropTypes.instanceOf(Error),
        isEditing: PropTypes.bool.isRequired,
        isSaving: PropTypes.bool.isRequired
    }).isRequired,
    selectedDomain: PropTypes.string.isRequired,
    selectedLanguage: PropTypes.string.isRequired,
    selectedString: PropTypes.shape({
        name: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        isDirty: PropTypes.bool.isRequired,
        isUpdating: PropTypes.bool.isRequired
    }).isRequired,
    strings: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
}

export default connect(stringEditorSelector)(LanguageChooser)