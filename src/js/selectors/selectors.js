import { createSelector } from 'reselect';

const domainsSelector = (state) => state.domains.items;
const errorsSelector = (state) => state.errors;
const filterTextSelector = (state) => state.filterText;
const languagesSelector = (state) => state.languages.items;
const newStringSelector = (state) => state.newString;
const selectedDomainSelector = (state) => state.selectedDomain;
const selectedLanguageSelector = (state) => state.selectedLanguage;
const selectedStringSelector = (state) => state.selectedString;
const stringsByDomainSelector = (state) => state.stringsByDomain;

const stringsSelector = createSelector(
    [selectedDomainSelector, stringsByDomainSelector],
    (selectedDomain, stringsByDomain) => {
        if (typeof stringsByDomain[selectedDomain] === 'undefined') {
            return [];
        }
        
        return stringsByDomain[selectedDomain].items;
    }
);

const filteredStringsSelector = createSelector(
    [filterTextSelector, stringsSelector],
    (filterText, strings) => {
        return strings.filter(s => s.name.includes(filterText));
    }
);

const domainsFetchingSelector = (state) => state.domains.isFetching;
const languagesFetchingSelector = (state) => state.languages.isFetching;
const stringsFetchingSelector = createSelector(
    [selectedDomainSelector, stringsByDomainSelector],
    (selectedDomain, stringsByDomain) => {
        if (typeof stringsByDomain[selectedDomain] === 'undefined') {
            return true;
        }
        
        return stringsByDomain[selectedDomain].isFetching;
    }
);

const isFetchingSelector = createSelector(
    [domainsFetchingSelector, languagesFetchingSelector, stringsFetchingSelector],
    (isFetchingDomains, isFetchingLanguages, isFetchingStrings) => {
        return {
            domains: isFetchingDomains,
            languages: isFetchingLanguages,
            strings: isFetchingStrings
        };
    }
);

export const appSelector = createSelector(
    [
        domainsSelector,
        errorsSelector,
        filteredStringsSelector,
        filterTextSelector,
        isFetchingSelector,
        languagesSelector,
        newStringSelector,
        selectedDomainSelector,
        selectedLanguageSelector,
        selectedStringSelector
    ],
    (domains, errors, filteredStrings, filterText, isFetching, languages, newString, selectedDomain, selectedLanguage, selectedString) => {
        return {
            domains,
            errors,
            filterText,
            isFetching,
            languages,
            newString,
            selectedDomain,
            selectedLanguage,
            selectedString,
            strings: filteredStrings
        };
    }
);
