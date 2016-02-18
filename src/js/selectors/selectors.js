import { createSelector } from 'reselect'

const domainsSelector = (state) => state.domains.items
const errorsSelector = (state) => state.errors
const filterTextSelector = (state) => state.filterText
const languagesSelector = (state) => state.languages.items
const newStringSelector = (state) => state.newString
const selectedDomainSelector = (state) => state.selectedDomain
const selectedLanguageSelector = (state) => state.selectedLanguage
const selectedStringSelector = (state) => state.selectedString
const stringsByDomainSelector = (state) => state.stringsByDomain
const searchResultsByTermSelector = (state) => state.searchResultsByTerm
const searchTermSelector = (state) => state.searchTerm

const stringsSelector = createSelector(
    [selectedDomainSelector, stringsByDomainSelector],
    (selectedDomain, stringsByDomain) => {
        if (typeof stringsByDomain[selectedDomain] === 'undefined') {
            return []
        }
        
        return stringsByDomain[selectedDomain].items
    }
)

const filteredStringsSelector = createSelector(
    [filterTextSelector, stringsSelector],
    (filterText, strings) => {
        return strings.filter(s => {
            if (s.name.includes(filterText)) {
                return true
            }
            
            if (s.translations.find(t => t.content.includes(filterText))) {
                return true
            }
            
            return false
        })
    }
)

const searchResultsSelector = createSelector(
    [searchTermSelector, searchResultsByTermSelector],
    (searchTerm, searchResultsByTerm) => {
        if (typeof searchResultsByTerm[searchTerm] === 'undefined') {
            return []
        }
        
        return searchResultsByTerm[searchTerm].items
    }
)

const domainsFetchingSelector = (state) => state.domains.isFetching
const languagesFetchingSelector = (state) => state.languages.isFetching
const stringsFetchingSelector = createSelector(
    [selectedDomainSelector, stringsByDomainSelector],
    (selectedDomain, stringsByDomain) => {
        if (typeof stringsByDomain[selectedDomain] === 'undefined') {
            return true
        }
        
        return stringsByDomain[selectedDomain].isFetching
    }
)
const searchResultsFetchingSelector = createSelector(
    [searchTermSelector, searchResultsByTermSelector],
    (searchTerm, searchResultsByTerm) => {
        if (typeof searchResultsByTerm[searchTerm] === 'undefined') {
            return true
        }
        
        return searchResultsByTerm[searchTerm].isFetching
    }
)

const isFetchingSelector = createSelector(
    [domainsFetchingSelector, languagesFetchingSelector, searchResultsFetchingSelector, stringsFetchingSelector],
    (isFetchingDomains, isFetchingLanguages, isFetchingSearchResults, isFetchingStrings) => {
        return {
            domains: isFetchingDomains,
            languages: isFetchingLanguages,
            searchResults: isFetchingSearchResults,
            strings: isFetchingStrings
        }
    }
)

export const appSelector = createSelector(
    [
        errorsSelector
    ],
    (errors) => {
        return {
            errors
        }
    }
)

export const domainChooserSelector = createSelector(
    [
        domainsSelector,
        isFetchingSelector
    ],
    (domains, isFetching) => {
        return {
            domains,
            isFetching
        }
    }
)

export const languageChooserSelector = createSelector(
    [
        domainsSelector,
        isFetchingSelector,
        languagesSelector,
        selectedDomainSelector
    ],
    (domains, isFetching, languages, selectedDomain) => {
        return {
            domains,
            isFetching,
            languages,
            selectedDomain
        }
    }
)

export const stringEditorSelector = createSelector(
    [
        domainsSelector,
        filteredStringsSelector,
        filterTextSelector,
        isFetchingSelector,
        languagesSelector,
        newStringSelector,
        selectedDomainSelector,
        selectedLanguageSelector,
        selectedStringSelector
    ],
    (domains, filteredStrings, filterText, isFetching, languages, newString, selectedDomain, selectedLanguage, selectedString) => {
        return {
            domains,
            filterText,
            isFetching,
            languages,
            newString,
            selectedDomain,
            selectedLanguage,
            selectedString,
            strings: filteredStrings
        }
    }
)

export const searchResultsContainerSelector = createSelector(
    [isFetchingSelector, searchResultsSelector, searchTermSelector],
    (isFetching, searchResults, searchTerm) => {
        return {
            isFetching,
            results: searchResults,
            term: searchTerm
        }
    }
)