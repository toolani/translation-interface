import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
    fetchDomains,
    selectDomain,
    fetchLanguages,
    selectLanguage,
    selectStringByName,
    clearSelectedString,
    editSelectedString,
    fetchStringsIfNeeded,
    saveSelectedString,
    startAddingNewString,
    clearNewString,
    editNewStringName,
    editNewStringContent,
    saveNewString,
    clearFilterText,
    editFilterText
} from '../actions/actions';
import { appSelector } from '../selectors/selectors';
import Picker from '../components/Picker';
import StringAdder from '../components/StringAdder';
import StringList from '../components/StringList';

class App extends Component {
    constructor(props) {
        super(props);
        this.handleDomainChange = this.handleDomainChange.bind(this);
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
        this.handleStringSelection = this.handleStringSelection.bind(this);
        this.handleCancelStringSelection = this.handleCancelStringSelection.bind(this);
        this.handleSelectedStringChange = this.handleSelectedStringChange.bind(this);
        this.handleSelectedStringSave = this.handleSelectedStringSave.bind(this);
        this.handleNewStringEditStart = this.handleNewStringEditStart.bind(this);
        this.handleNewStringEditCancel = this.handleNewStringEditCancel.bind(this);
        this.handleNewStringChange = this.handleNewStringChange.bind(this);
        this.handleNewStringSave = this.handleNewStringSave.bind(this);
        this.handleFilterTextClear = this.handleFilterTextClear.bind(this);
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    }
    
    componentDidMount() {
        const { dispatch, selectedDomain } = this.props;
        dispatch(fetchDomains());
        dispatch(fetchLanguages());
        dispatch(fetchStringsIfNeeded(selectedDomain));
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedDomain !== this.props.selectedDomain) {
            const { dispatch, selectedDomain } = nextProps;
            dispatch(fetchStringsIfNeeded(selectedDomain));
        }
    }
    
    handleDomainChange(nextDomain) {
        this.props.dispatch(selectDomain(nextDomain));
    }
    
    handleLanguageChange(nextLanguage) {
        this.props.dispatch(selectLanguage(nextLanguage));
    }
    
    handleNewStringEditStart() {
        this.props.dispatch(startAddingNewString());
    }
    
    handleNewStringEditCancel() {
        this.props.dispatch(clearNewString());
    }
    
    handleFilterTextChange(e) {
        this.props.dispatch(editFilterText(e.target.value));
    }
    
    handleFilterTextClear() {
        this.this.props.dispatch(clearFilterText());
    }
    
    handleNewStringChange(field, value) {
        switch (field) {
        case 'content':
            this.props.dispatch(editNewStringContent(value));
            break;
        case 'name':
            this.props.dispatch(editNewStringName(value));
            break;
        }
    }
    
    handleNewStringSave() {
        this.props.dispatch(saveNewString());
    }
    
    handleStringSelection(nextString) {
        this.props.dispatch(selectStringByName(nextString));
    }
    
    handleCancelStringSelection() {
        this.props.dispatch(clearSelectedString());
    }
    
    handleSelectedStringChange(nextContent) {
        this.props.dispatch(editSelectedString(nextContent));
    }
    
    handleSelectedStringSave() {
        this.props.dispatch(saveSelectedString());
    }
    
    render() {
        const {
            selectedDomain,
            domains,
            errors,
            filterText,
            selectedLanguage,
            languages,
            newString,
            selectedString,
            strings,
            isFetching
        } = this.props;
        const hasSelectedDomain = selectedDomain !== "";
        const hasSelectedLanguage = selectedLanguage !== "";
        const isFiltered = !!filterText.length;
        
        let instrucParts = [];
        if (!hasSelectedDomain) {
            instrucParts.push('a translation domain');
        }
        if (!hasSelectedLanguage) {
            instrucParts.push('a language');
        }
        let instructions = `Editing translation domain '${selectedDomain}'`;
        if (instrucParts.length > 0) {
            instructions = 'Please select '+ instrucParts.join(' and ');
        }
        
        return (
            <div className="container">
                <div className="row">
                
                {!!errors.length && 
                    <div className="col-md-12">
                        {errors.map(e => <div className="alert alert-danger">{e.message}</div>)}
                    </div>
                }
                
                {!isFetching.domains &&
                    <div className="col-md-2">
                        <Picker value={selectedDomain}
                                disabled={selectedString.isDirty || newString.isEditing}
                                onChange={this.handleDomainChange}
                                options={domains}
                                showEmptyOption={!hasSelectedDomain}
                                title="Translation domain" />
                    </div>
                }
                
                {!isFetching.languages && 
                    <div className="col-md-3">
                        <Picker value={selectedLanguage}
                                disabled={selectedString.isDirty || newString.isEditing}
                                onChange={this.handleLanguageChange}
                                labels={languages.map(lang => `${lang.name} (${lang.code})`)}
                                options={languages.map(lang => lang.code)}
                                showEmptyOption={!hasSelectedLanguage}
                                title="Language" />
                    </div>
                }
                
                {hasSelectedDomain && hasSelectedLanguage && !isFetching.strings &&
                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="string-filter">Filter</label>
                            <input className="form-control"
                                   id="string-filter"
                                   onChange={this.handleFilterTextChange}
                                   placeholder="Type to filter list"
                                   type="text"
                                   value={filterText}/>
                        </div>
                    </div>
                }
                    
                    <div className="col-md-12">
                        <p>{instructions}</p>
                    </div>
                </div>
                
                {hasSelectedLanguage && hasSelectedDomain && !isFetching.strings &&
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
                
                {hasSelectedDomain && isFetching.strings && strings.length === 0 &&
                    <div className="row">
                        <div className="col-md-12">
                            <p>Loading...</p>
                        </div>
                    </div>
                }
                
                {hasSelectedDomain && !isFetching.strings && !isFiltered && strings.length === 0  &&
                    <div className="row">
                        <div className="col-md-12">
                            <p>Translation domain is empty.</p>
                        </div>
                    </div>
                }
                
                {hasSelectedDomain && !isFetching.strings && isFiltered && strings.length === 0  &&
                    <div className="row">
                        <div className="col-md-12">
                            <p>No matches found for "{filterText}".</p>
                        </div>
                    </div>
                }
                
                {strings.length > 0 && hasSelectedLanguage &&
                    <StringList strings={strings} 
                                editLanguage={selectedLanguage}
                                onSelect={this.handleStringSelection}
                                onEditCancel={this.handleCancelStringSelection}
                                onEditChange={this.handleSelectedStringChange}
                                onEditSave={this.handleSelectedStringSave}
                                selectedString={selectedString} />
                }
            </div>
        );
    }
}

App.propTypes = {
    domains: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    errors: PropTypes.arrayOf(PropTypes.instanceOf(Error)).isRequired,
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
};

export default connect(appSelector)(App);