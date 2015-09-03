import fetch from 'isomorphic-fetch';

export const REQUEST_DOMAINS = 'REQUEST_DOMAINS';
export const RECEIVE_DOMAINS = 'RECEIVE_DOMAINS';
export const SELECT_DOMAIN = 'SELECT_DOMAIN';
export const INVALIDATE_DOMAINS = 'INVALIDATE_DOMAINS';

export const REQUEST_LANGUAGES = 'REQUEST_LANGUAGES';
export const RECEIVE_LANGUAGES = 'RECEIVE_LANGUAGES';
export const SELECT_LANGUAGE = 'SELECT_LANGUAGE';

export const REQUEST_STRINGS = 'REQUEST_STRINGS';
export const RECEIVE_STRINGS = 'RECEIVE_STRINGS';
export const SELECT_STRING = 'SELECT_STRING';
export const CLEAR_SELECTED_STRING = 'CLEAR_SELECTED_STRING';
export const EDIT_SELECTED_STRING = 'EDIT_SELECTED_STRING';
export const UPDATE_SELECTED_STRING_REQUEST = 'UPDATE_SELECTED_STRING_REQUEST';
export const UPDATE_SELECTED_STRING_SUCCESS = 'UPDATE_SELECTED_STRING_SUCCESS';
export const UPDATE_SELECTED_STRING_FAILURE = 'UPDATE_SELECTED_STRING_FAILURE';

export const START_ADDING_NEW_STRING = 'START_ADDING_NEW_STRING';
export const CLEAR_NEW_STRING = 'CLEAR_NEW_STRING';
export const EDIT_NEW_STRING = 'EDIT_NEW_STRING';
export const CREATE_NEW_STRING_REQUEST = 'CREATE_NEW_STRING_REQUEST';
export const CREATE_NEW_STRING_SUCCESS = 'CREATE_NEW_STRING_SUCCESS';
export const CREATE_NEW_STRING_FAILURE = 'CREATE_NEW_STRING_FAILURE';

export function selectDomain(domain) {
    return {
        type: SELECT_DOMAIN,
        domain
    };
}

export function invalidateDomains() {
    return { type: INVALIDATE_DOMAINS };
}

export function requestDomains() {
  return { type: REQUEST_DOMAINS };
}

export function receiveDomains(json) {
    return {
        type: RECEIVE_DOMAINS,
        domains: json.domains,
        receivedAt: Date.now()
    };
}

export function fetchDomains() {
    return function(dispatch) {
        dispatch(requestDomains());
        
        return fetch('/translation-api/domains')
            .then(response => response.json())
            .then(json => dispatch(receiveDomains(json)));
    };
}

export function selectLanguage(language) {
    return {
        type: SELECT_LANGUAGE,
        language
    };
}

export function requestLanguages() {
    return {
        type: REQUEST_LANGUAGES
    };
}

export function receiveLanguages(json) {
    return {
        type: RECEIVE_LANGUAGES,
        languages: json,
        receivedAt: Date.now()
    };
}

export function fetchLanguages() {
    return function(dispatch) {
        dispatch(requestLanguages());
        
        return fetch('/translation-api/languages')
            .then(response => response.json())
            .then(json => dispatch(receiveLanguages(json)));
    };
}

export function requestStrings(domain) {
    return {
        type: REQUEST_STRINGS,
        domain
    };
}

export function receiveStrings(domain, json) {
    return {
        type: RECEIVE_STRINGS,
        domain,
        strings: json.strings,
        receivedAt: Date.now()
    };
}

export function fetchStrings(domain) {
    return dispatch => {
        dispatch(requestStrings());
        
        return fetch(`/translation-api/domains/${domain}`)
            .then(response => response.json())
            .then(json => {
                // Transform 'translations' from a map of lang -> content to an object with language & content keys
                const strings = json.strings.map(s => {
                    let translations = [];
                    for (let lang in s.translations) {
                        translations.push({
                            language: lang,
                            content: s.translations[lang].content
                        });
                    }
                    
                    return Object.assign({}, s, {translations});
                });
                
                return Object.assign({}, json, {strings});
            })
            .then(normJson => dispatch(receiveStrings(domain, normJson)));
    };
}

export function shouldFetchStrings(state, domain) {
    const strings = state.stringsByDomain[domain];
    if (domain === '') {
        return false;
    } else if (!strings) {
        return true;
    } else if (strings.isFetching) {
        return false;
    } else {
        return strings.didInvalidate;
    }
}

export function fetchStringsIfNeeded(domain) {
    return (dispatch, getState) => {
        if (shouldFetchStrings(getState(), domain)) {
            return dispatch(fetchStrings(domain));
        }
    };
}

export function selectString(string, content) {
    return {
        type: SELECT_STRING,
        string,
        content
    };
}

export function clearSelectedString() {
    return {type: CLEAR_SELECTED_STRING};
}

export function selectStringByName(string) {
    return (dispatch, getState) => {
        // Check a domain is selected
        const {selectedDomain, selectedLanguage, stringsByDomain} = getState();
        const strings = stringsByDomain[selectedDomain];
        
        if (!strings) {
            throw new Error('Tried to select string when no strings are available.');
        }
        
        // Check the given string exists in the currently selected domain
        const currString = strings.items.find(s => s.name === string);
        
        if (! currString) {
            throw new Error(`Tried to select non-existent string '${string}'`);
        }
        
        // Get the current string content for the currently selected language
        const translation = currString.translations.find(t => t.language == selectedLanguage) || {
            content: ""
        };
        
        dispatch(selectString(string, translation.content));
    };
}

export function editSelectedString(newContent) {
    return {
        type: EDIT_SELECTED_STRING,
        content: newContent
    };
}

function findString(domain, stringName) {
    if (typeof domain === 'undefined') {
        return undefined;
    }
    
    return domain.items.find(s => s.name === stringName);
}

function findTranslation(string, findLanguage) {
    if (typeof string === 'undefined') {
        return undefined;
    }
    
    return string.translations.find(t => t.language === findLanguage);
}

export function saveSelectedString() {
    return (dispatch, getState) => {
        dispatch({type: UPDATE_SELECTED_STRING_REQUEST});
        
        const {selectedDomain, selectedLanguage, selectedString, stringsByDomain} = getState();
        const string = findString(stringsByDomain[selectedDomain], selectedString.name);
        const translation = findTranslation(string, selectedLanguage);
        // const translation = stringsByDomain[selectedDomain].items.find(s => s.name === selectedString.name).translations.find(t => t.language === selectedLanguage);
        const method = translation ? 'put' : 'post';
        
        fetch(`/translation-api/domains/${selectedDomain}/strings/${selectedString.name}/translations/${selectedLanguage}`, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: selectedString.content
            })
        })
            .then(response => {
                if (response.status === 200) {
                    dispatch({
                        type: UPDATE_SELECTED_STRING_SUCCESS,
                        domain: selectedDomain,
                        language: selectedLanguage,
                        name: selectedString.name,
                        content: selectedString.content
                    });
                } else {
                    dispatch({
                        type: UPDATE_SELECTED_STRING_FAILURE,
                        error: new Error(`Save failed with status: ${response.status}`)
                    });
                }
            });
    };
}

export function startAddingNewString() {
    return {
        type: START_ADDING_NEW_STRING
    };
}

export function clearNewString() {
    return {
        type: CLEAR_NEW_STRING
    };
}

export function editNewStringName(newName) {
    return {
        type: EDIT_NEW_STRING,
        name: newName
    };
}

export function editNewStringContent(newContent) {
    return {
        type: EDIT_NEW_STRING,
        content: newContent
    };
}

export function saveNewString() {
    return (dispatch, getState) => {
        dispatch({type: CREATE_NEW_STRING_REQUEST});
        
        const {newString, selectedDomain, selectedLanguage, stringsByDomain} = getState();
        const exists = typeof findString(stringsByDomain[selectedDomain], newString.name) !== 'undefined';
        
        if (exists) {
            dispatch({
                type: CREATE_NEW_STRING_FAILURE,
                error: new Error(`A string with the name '${newString.name}' already exists`)
            });
            return;
        }
        
        fetch(`/translation-api/domains/${selectedDomain}/strings/${newString.name}/translations/${selectedLanguage}`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: newString.content
            })
        })
            .then(response => {
                if (response.status === 200) {
                    dispatch({
                        type: CREATE_NEW_STRING_SUCCESS,
                        domain: selectedDomain,
                        language: selectedLanguage,
                        name: newString.name,
                        content: newString.content
                    });
                } else {
                    dispatch({
                        type: CREATE_NEW_STRING_FAILURE,
                        error: new Error(`Save failed with status: ${response.status}`)
                    });
                }
            });
    };
}