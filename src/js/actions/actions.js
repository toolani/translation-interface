import fetch from 'isomorphic-fetch'

export const FETCH_DOMAINS_REQUEST = 'FETCH_DOMAINS_REQUEST'
export const FETCH_DOMAINS_SUCCESS = 'FETCH_DOMAINS_SUCCESS'
export const FETCH_DOMAINS_FAILURE = 'FETCH_DOMAINS_FAILURE'
export const SELECT_DOMAIN = 'SELECT_DOMAIN'
export const INVALIDATE_DOMAINS = 'INVALIDATE_DOMAINS'

export const FETCH_LANGUAGES_REQUEST = 'FETCH_LANGUAGES_REQUEST'
export const FETCH_LANGUAGES_SUCCESS = 'FETCH_LANGUAGES_SUCCESS'
export const FETCH_LANGUAGES_FAILURE = 'FETCH_LANGUAGES_FAILURE'
export const SELECT_LANGUAGE = 'SELECT_LANGUAGE'

export const FETCH_STRINGS_REQUEST = 'FETCH_STRINGS_REQUEST'
export const FETCH_STRINGS_SUCCESS = 'FETCH_STRINGS_SUCCESS'
export const FETCH_STRINGS_FAILURE = 'FETCH_STRINGS_FAILURE'
export const SELECT_STRING = 'SELECT_STRING'
export const CLEAR_SELECTED_STRING = 'CLEAR_SELECTED_STRING'
export const EDIT_SELECTED_STRING = 'EDIT_SELECTED_STRING'
export const UPDATE_SELECTED_STRING_REQUEST = 'UPDATE_SELECTED_STRING_REQUEST'
export const UPDATE_SELECTED_STRING_SUCCESS = 'UPDATE_SELECTED_STRING_SUCCESS'
export const UPDATE_SELECTED_STRING_FAILURE = 'UPDATE_SELECTED_STRING_FAILURE'

export const START_ADDING_NEW_STRING = 'START_ADDING_NEW_STRING'
export const CLEAR_NEW_STRING = 'CLEAR_NEW_STRING'
export const EDIT_NEW_STRING = 'EDIT_NEW_STRING'
export const CREATE_NEW_STRING_REQUEST = 'CREATE_NEW_STRING_REQUEST'
export const CREATE_NEW_STRING_SUCCESS = 'CREATE_NEW_STRING_SUCCESS'
export const CREATE_NEW_STRING_FAILURE = 'CREATE_NEW_STRING_FAILURE'

export const EDIT_FILTER_TEXT = 'EDIT_FILTER_TEXT'
export const CLEAR_FILTER_TEXT = 'CLEAR_FILTER_TEXT'

export const PERFORM_SEARCH_REQUEST = 'PERFORM_SEARCH_REQUEST'
export const PERFORM_SEARCH_SUCCESS = 'PERFORM_SEARCH_SUCCESS'
export const PERFORM_SEARCH_FAILURE = 'PERFORM_SEARCH_FAILURE'
export const EDIT_SEARCH_TERM = 'EDIT_SEARCH_TERM'

function checkStatus(response) {
    if (response.status >= 400) {
        throw new Error(`Request failed with status '${response.status}'`)
    }
    
    return response
}

function reportHttpError(dispatch, type, message) {
    return function(error) {
        dispatch({
            type: type,
            error: new Error(message + ` (${error.message})`)
        })
    }
}

export function selectDomain(domain) {
    return {
        type: SELECT_DOMAIN,
        domain
    }
}

export function invalidateDomains() {
    return { type: INVALIDATE_DOMAINS }
}

function requestDomains() {
  return { type: FETCH_DOMAINS_REQUEST }
}

function receiveDomains(json) {
    return {
        type: FETCH_DOMAINS_SUCCESS,
        domains: json.domains,
        receivedAt: Date.now()
    }
}

export function fetchDomains() {
    return function(dispatch) {
        dispatch(requestDomains())
        
        return fetch('/translation-api/domains')
            .then(checkStatus)
            .then(response => response.json())
            .then(json => dispatch(receiveDomains(json)))
            .catch(reportHttpError(dispatch, FETCH_DOMAINS_FAILURE, "Could not fetch translation domain list"))
    }
}

export function selectLanguage(language) {
    return {
        type: SELECT_LANGUAGE,
        language
    }
}

function requestLanguages() {
    return {
        type: FETCH_LANGUAGES_REQUEST
    }
}

function receiveLanguages(json) {
    return {
        type: FETCH_LANGUAGES_SUCCESS,
        languages: json,
        receivedAt: Date.now()
    }
}

export function fetchLanguages() {
    return function(dispatch) {
        dispatch(requestLanguages())
        
        return fetch('/translation-api/languages')
            .then(checkStatus)
            .then(response => response.json())
            .then(json => dispatch(receiveLanguages(json)))
            .catch(reportHttpError(dispatch, FETCH_LANGUAGES_FAILURE, "Could not fetch language list"))
    }
}

function requestStrings(domain) {
    return {
        type: FETCH_STRINGS_REQUEST,
        domain
    }
}

function receiveStrings(domain, json) {
    return {
        type: FETCH_STRINGS_SUCCESS,
        domain,
        strings: json.strings,
        receivedAt: Date.now()
    }
}

function fetchStrings(domain) {
    return dispatch => {
        dispatch(requestStrings(domain))
        
        return fetch(`/translation-api/domains/${domain}`)
            .then(checkStatus)
            .then(response => response.json())
            .then(json => {
                // Transform 'translations' from a map of lang -> content to an object with language & content keys
                const strings = json.strings.map(s => {
                    let translations = []
                    for (let lang in s.translations) {
                        translations.push({
                            language: lang,
                            content: s.translations[lang].content
                        })
                    }
                    
                    return Object.assign({}, s, {translations})
                })
                
                return Object.assign({}, json, {strings})
            })
            .then(normJson => dispatch(receiveStrings(domain, normJson)))
            .catch(reportHttpError(dispatch, FETCH_STRINGS_FAILURE, "Could not get list of translation strings"))
    }
}

function shouldFetchStrings(state, domain) {
    const strings = state.stringsByDomain[domain]
    if (domain === '') {
        return false
    } else if (!strings) {
        return true
    } else if (strings.isFetching) {
        return false
    }
    
    // Expire the local copy of a domain's string data after 30 seconds
    const expireAfter = 30 * 1000
    const resultAge = Date.now() - strings.lastUpdated
    
    if (resultAge > expireAfter) {
        return true
    } else {
        return strings.didInvalidate
    }
}

export function fetchStringsIfNeeded(domain) {
    return (dispatch, getState) => {
        if (shouldFetchStrings(getState(), domain)) {
            return dispatch(fetchStrings(domain))
        }
    }
}

export function selectString(string, content) {
    return {
        type: SELECT_STRING,
        string,
        content
    }
}

export function clearSelectedString() {
    return {type: CLEAR_SELECTED_STRING}
}

export function selectStringByName(string) {
    return (dispatch, getState) => {
        // Check a domain is selected
        const {selectedDomain, selectedLanguage, stringsByDomain} = getState()
        const strings = stringsByDomain[selectedDomain]
        
        if (!strings) {
            throw new Error('Tried to select string when no strings are available.')
        }
        
        // Check the given string exists in the currently selected domain
        const currString = strings.items.find(s => s.name === string)
        
        if (! currString) {
            throw new Error(`Tried to select non-existent string '${string}'`)
        }
        
        // Get the current string content for the currently selected language
        const translation = currString.translations.find(t => t.language == selectedLanguage) || {
            content: ""
        }
        
        dispatch(selectString(string, translation.content))
    }
}

export function editSelectedString(newContent) {
    return {
        type: EDIT_SELECTED_STRING,
        content: newContent
    }
}

function findString(domain, stringName) {
    if (typeof domain === 'undefined') {
        return undefined
    }
    
    return domain.items.find(s => s.name === stringName)
}

function findTranslation(string, findLanguage) {
    if (typeof string === 'undefined') {
        return undefined
    }
    
    return string.translations.find(t => t.language === findLanguage)
}

export function saveSelectedString() {
    return (dispatch, getState) => {
        dispatch({type: UPDATE_SELECTED_STRING_REQUEST})
        
        const {selectedDomain, selectedLanguage, selectedString, stringsByDomain} = getState()
        const string = findString(stringsByDomain[selectedDomain], selectedString.name)
        const translation = findTranslation(string, selectedLanguage)
        // const translation = stringsByDomain[selectedDomain].items.find(s => s.name === selectedString.name).translations.find(t => t.language === selectedLanguage)
        const method = translation ? 'put' : 'post'
        
        fetch(`/translation-api/domains/${selectedDomain}/strings/${selectedString.name}/translations/${selectedLanguage}`, {
            method: method,
            headers: {
                Accept: 'application/json',
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
                    })
                } else {
                    dispatch({
                        type: UPDATE_SELECTED_STRING_FAILURE,
                        error: new Error(`Save failed with status: ${response.status}`)
                    })
                }
            })
    }
}

export function startAddingNewString() {
    return {
        type: START_ADDING_NEW_STRING
    }
}

export function clearNewString() {
    return {
        type: CLEAR_NEW_STRING
    }
}

export function editNewStringName(newName) {
    return {
        type: EDIT_NEW_STRING,
        name: newName
    }
}

export function editNewStringContent(newContent) {
    return {
        type: EDIT_NEW_STRING,
        content: newContent
    }
}

export function saveNewString() {
    return (dispatch, getState) => {
        dispatch({type: CREATE_NEW_STRING_REQUEST})
        
        const {newString, selectedDomain, selectedLanguage, stringsByDomain} = getState()
        const exists = typeof findString(stringsByDomain[selectedDomain], newString.name) !== 'undefined'
        
        if (exists) {
            dispatch({
                type: CREATE_NEW_STRING_FAILURE,
                error: new Error(`A string with the name '${newString.name}' already exists`)
            })
            return
        }
        
        fetch(`/translation-api/domains/${selectedDomain}/strings/${newString.name}/translations/${selectedLanguage}`, {
            method: 'post',
            headers: {
                Accept: 'application/json',
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
                    })
                } else {
                    dispatch({
                        type: CREATE_NEW_STRING_FAILURE,
                        error: new Error(`Save failed with status: ${response.status}`)
                    })
                }
            })
    }
}

export function editFilterText(filterText) {
    return {
        type: EDIT_FILTER_TEXT,
        text: filterText
    }
}

export function clearFilterText() {
    return {
        type: CLEAR_FILTER_TEXT
    }
}

function requestSearch(searchTerm) {
    return {
        type: PERFORM_SEARCH_REQUEST,
        searchTerm
    }
}

function receiveSearchResults(searchTerm, results) {
    return {
        type: PERFORM_SEARCH_SUCCESS,
        searchTerm,
        results,
        receivedAt: Date.now()
    }
}

function fetchSearchResults(searchTerm) {
    return dispatch => {
        dispatch(requestSearch(searchTerm))
        
        return fetch(`translation-api/search?term=${encodeURIComponent(searchTerm)}&by=all`)
            .then(checkStatus)
            .then(response => response.json())
            .then(json => json.map(res => {
                return {
                    domainName: res.domain_name,
                    stringName: res.string_name,
                    languageCode: res.language_code,
                    translationContent: res.translation_content
                }
            }))
            .then(results => dispatch(receiveSearchResults(searchTerm, results)))
            .catch(reportHttpError(dispatch, PERFORM_SEARCH_FAILURE, "Could not perform search"))
    }
}

function shouldFetchSearchResults(state, searchTerm) {
    const results = state.searchResultsByTerm[searchTerm]
    
    if (searchTerm === '') {
        return false
    } else if (!results) {
        return true
    } else if (results.isFetching) {
        return false
    }
    
    // Expire the local list of search results for a given term after 30 seconds
    const expireAfter = 30 * 1000
    const resultAge = Date.now() - results.lastUpdated
    
    if (resultAge > expireAfter) {
        return true
    } else {
        return results.didInvalidate
    }
}

function editSearchTerm(searchTerm) {
    return {
        type: EDIT_SEARCH_TERM,
        searchTerm
    }
}

function shouldEditSearchTerm(state, searchTerm) {
    return searchTerm !== state.searchTerm
}

export function fetchSearchResultsIfNeeded(searchTerm) {
    return (dispatch, getState) => {
        if (shouldEditSearchTerm(getState(), searchTerm)) {
            dispatch(editSearchTerm(searchTerm))
        }
        
        if (shouldFetchSearchResults(getState(), searchTerm)) {
            return dispatch(fetchSearchResults(searchTerm))
        }
    }
}