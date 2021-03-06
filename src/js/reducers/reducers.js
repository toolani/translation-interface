import { combineReducers } from 'redux'
import { routeReducer } from 'react-router-redux'
import {
  FETCH_DOMAINS_REQUEST,
  FETCH_DOMAINS_SUCCESS,
  FETCH_DOMAINS_FAILURE,
  SELECT_DOMAIN,
  INVALIDATE_DOMAINS,
  FETCH_LANGUAGES_REQUEST,
  FETCH_LANGUAGES_SUCCESS,
  FETCH_LANGUAGES_FAILURE,
  SELECT_LANGUAGE,
  FETCH_STRINGS_REQUEST,
  FETCH_STRINGS_SUCCESS,
  FETCH_STRINGS_FAILURE,
  SELECT_STRING,
  CLEAR_SELECTED_STRING,
  EDIT_SELECTED_STRING,
  UPDATE_SELECTED_STRING_REQUEST,
  UPDATE_SELECTED_STRING_SUCCESS,
  UPDATE_SELECTED_STRING_FAILURE,
  START_ADDING_NEW_STRING,
  CLEAR_NEW_STRING,
  EDIT_NEW_STRING,
  CREATE_NEW_STRING_REQUEST,
  CREATE_NEW_STRING_SUCCESS,
  CREATE_NEW_STRING_FAILURE,
  DELETE_STRING_REQUEST,
  DELETE_STRING_SUCCESS,
  DELETE_STRING_FAILURE,
  DELETE_TRANSLATION_REQUEST,
  DELETE_TRANSLATION_SUCCESS,
  DELETE_TRANSLATION_FAILURE,
  EDIT_FILTER_TEXT,
  CLEAR_FILTER_TEXT,
  PERFORM_SEARCH_REQUEST,
  PERFORM_SEARCH_SUCCESS,
  PERFORM_SEARCH_FAILURE,
  EDIT_SEARCH_TERM
} from '../actions/actions'

// The name of the currently selected domain as a string
function selectedDomain(state = "", action) {
  switch(action.type) {
  case SELECT_DOMAIN:
    return action.domain
  default:
    return state
  }
}

/*
{
  isFetching: false,
  didInvalidate: false,
  items: ["breadcrumb", "contact"]
}
 */
function domains(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
  case INVALIDATE_DOMAINS:
    return Object.assign({}, state, {
      didInvalidate: true
    })
  case FETCH_DOMAINS_REQUEST:
    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false
    })
  case FETCH_DOMAINS_SUCCESS:
    return Object.assign({}, state, {
      isFetching: false,
      didInvalidate: false,
      items: action.domains.slice(),
      lastUpdated: action.receivedAt
    })
  case FETCH_DOMAINS_FAILURE:
    return Object.assign({}, state, {
      isFetching: false
    })
  default:
    return state
  }
}

// An array of errors
function errors(state = [], action) {
  switch (action.type) {
  case FETCH_DOMAINS_FAILURE:
  case FETCH_LANGUAGES_FAILURE:
  case FETCH_STRINGS_FAILURE:
  case DELETE_STRING_FAILURE:
  case DELETE_TRANSLATION_FAILURE:
    return [...state.slice(), action.error]
  default:
    return state
  }
}

// The filter text to apply to the string list as a string
function filterText(state = "", action) {
  switch(action.type) {
  case CLEAR_FILTER_TEXT:
    return ""
  case EDIT_FILTER_TEXT:
    return action.text
  default:
    return state
  }
}

// Code for the currently selected language as a string
function selectedLanguage(state = "", action) {
  switch(action.type) {
  case SELECT_LANGUAGE:
    return action.language
  default:
    return state
  }
}

/*
{
  isFetching: false,
  didInvalidate: false,
  items: [
    {
      code: "de",
      name: "German"
    },
    {
      code: "de-at",
      name: "German (Austria)"
    }
  ]
}
 */
function languages(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch(action.type) {
  case FETCH_LANGUAGES_REQUEST:
    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false
    })
  case FETCH_LANGUAGES_SUCCESS:
    return Object.assign({}, state, {
      isFetching: false,
      didInvalidate: false,
      items: action.languages.slice(),
      lastUpdated: action.receivedAt
    })
  case FETCH_LANGUAGES_FAILURE:
    return Object.assign({}, state, {
      isFetching: false
    })
  default:
    return state
  }
}

/*
{
  name: "",
  content: "",
  error: null,
  isBeingEdited: false,
  isSaving: false
}
 */
function newString(state = {
  name: "",
  content: "",
  error: null,
  isEditing: false,
  isSaving: false
}, action) {
  switch(action.type) {
  case START_ADDING_NEW_STRING:
    return Object.assign({}, state, {isEditing: true})
  case CLEAR_NEW_STRING:
    return Object.assign({}, state, {
      name: "",
      content: "",
      error: null,
      isEditing: false,
      isSaving: false
    })
  case EDIT_NEW_STRING:
    if (typeof action.name !== 'undefined') {
      return Object.assign({}, state, {
        name: action.name
      })
    }
    return Object.assign({}, state, {
      content: action.content
    })
  case CREATE_NEW_STRING_REQUEST:
    return Object.assign({}, state, {isSaving: true})
  case CREATE_NEW_STRING_SUCCESS:
    return Object.assign({}, state, {
      name: "",
      content: "",
      error: null,
      isEditing: false,
      isSaving: false
    })
  case CREATE_NEW_STRING_FAILURE:
    return Object.assign({}, state, {
      error: action.error,
      isSaving: false
    })
  default:
    return state
  }
}

/*
{
  name: "greeting",
  content: "hello there",
  error: null,
  dirty: true,
  isUpdating: false
}
 */
function selectedString(state = {
  name: "",
  content: "",
  error: null,
  isDirty: false,
  isUpdating: false
}, action) {
  switch(action.type) {
  case SELECT_STRING:
    return Object.assign({}, state, {
      name: action.string,
      content: action.content,
      error: null,
      isDirty: false,
      isUpdating: false
    })
  case EDIT_SELECTED_STRING:
    if (action.content !== state.content) {
      return Object.assign({}, state, {
        content: action.content,
        isDirty: true
      })
    }
    return state
  case UPDATE_SELECTED_STRING_REQUEST:
    return Object.assign({}, state, {isUpdating: true})
  case CLEAR_SELECTED_STRING:
  case UPDATE_SELECTED_STRING_SUCCESS:
    return Object.assign({}, state, {
      name: "",
      content: "",
      error: null,
      isDirty: false,
      isUpdating: false
    })
  case UPDATE_SELECTED_STRING_FAILURE:
    return Object.assign({}, state, {isUpdating: false, error: action.error})
  default:
    return state
  }
}

/*
{
  isFetching: false,
  didInvalidate: false,
  items: [
    {
      name: "greeting",
      translations: [
      {
        language: "en",
        content: "hello"
      }
  ]
}
 */
function strings(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch(action.type) {
  case FETCH_STRINGS_REQUEST:
    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false
    })
  case FETCH_STRINGS_SUCCESS:
    return Object.assign({}, state, {
      isFetching: false,
      didInvalidate: false,
      items: action.strings.slice(),
      lastUpdated: action.receivedAt
    })
  case FETCH_STRINGS_FAILURE:
    return Object.assign({}, state, {
      isFetching: false
    })
  case CREATE_NEW_STRING_SUCCESS:
    return Object.assign({}, state, {
      items: [
        {
          name: action.name,
          translations: [{
            language: action.language,
            content: action.content
          }]
        },
        ...state.items.slice()
      ]
    })
  case UPDATE_SELECTED_STRING_SUCCESS:
    const strIndex = state.items.findIndex(i => i.name === action.name)
    const trnIndex = state.items[strIndex].translations.findIndex(t => t.language === action.language)
    const translations = [
      ...state.items[strIndex].translations.slice(0, trnIndex),
      Object.assign({}, state.items[strIndex].translations[trnIndex], {
        language: action.language,
        content: action.content
      }),
      ...state.items[strIndex].translations.slice(trnIndex + 1)
    ]
    const items = [
      ...state.items.slice(0, strIndex),
      Object.assign({}, state.items[strIndex], {translations: translations}),
      ...state.items.slice(strIndex + 1)
    ]
    return Object.assign({}, state, {items: items})
  case DELETE_STRING_REQUEST:
  case DELETE_TRANSLATION_REQUEST:
    return Object.assign({}, state, {
      isFetching: true
    })
  case DELETE_STRING_SUCCESS:
    const delIndex = state.items.findIndex(i => i.name === action.name)
    return Object.assign({}, {
      items: [
        ...state.items.slice(0, delIndex),
        ...state.items.slice(delIndex + 1)
      ],
      isFetching: false
    })
  case DELETE_TRANSLATION_SUCCESS:
    return Object.assign({}, deleteTranslation(state, action.name, action.language), {isFetching: false})
  case DELETE_STRING_FAILURE:
  case DELETE_TRANSLATION_FAILURE:
    return Object.assign({}, {
      isFetching: false
    })
  default:
    return state
  }
}

/**
 * Deletes a translation from a string in the given domain.
 * @param  {object} domain       The state returned by strings(...)
 * @param  {string} stringName   String to delete the translation from.
 * @param  {string} languageCode Language code of the translation to be deleted.
 * @return {object}              Copy of `domain` with updated `items` list.
 */
function deleteTranslation(domain, stringName, languageCode) {
  const strIndex = domain.items.findIndex(i => i.name === stringName)
  const trnIndex = domain.items[strIndex].translations.findIndex(t => t.language === languageCode)
  const translations = [
    ...domain.items[strIndex].translations.slice(0, trnIndex),
    ...domain.items[strIndex].translations.slice(trnIndex + 1)
  ]
  const items = [
    ...domain.items.slice(0, strIndex),
    Object.assign({}, domain.items[strIndex], {translations: translations}),
    ...domain.items.slice(strIndex + 1)
  ]
  
  return Object.assign({}, domain, {
    items: items
  })
}

// A map of domain name -> the result of 'strings'
function stringsByDomain(state = {}, action) {
  switch(action.type) {
    case FETCH_STRINGS_REQUEST:
    case FETCH_STRINGS_SUCCESS:
    case FETCH_STRINGS_FAILURE:
    case CREATE_NEW_STRING_SUCCESS:
    case UPDATE_SELECTED_STRING_SUCCESS:
    case DELETE_STRING_REQUEST:
    case DELETE_STRING_SUCCESS:
    case DELETE_STRING_FAILURE:
    case DELETE_TRANSLATION_REQUEST:
    case DELETE_TRANSLATION_SUCCESS:
    case DELETE_TRANSLATION_FAILURE:
      return Object.assign({}, state, {
        [action.domain]: strings(state[action.domain], action)
      })
    default:
      return state
  }
}

/*
{
  isFetching: false,
  didInvalidate: false,
  lastUpdated: <Date>
  items: [
    {
      domain_name: "messages",
      string_name: "greeting",
      language_code: "en",
      translation_content: "hello"
    }
  ]
}
 */
function searchResults(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch(action.type) {
    case PERFORM_SEARCH_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case PERFORM_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.results,
        lastUpdated: action.receivedAt
      })
    case PERFORM_SEARCH_FAILURE:
      return Object.assign({}, state, {
        isFetching: false
      })
    default:
      return state
  }
}

// String containing the most recently searched search term
function searchTerm(state = "", action) {
  switch(action.type) {
    case EDIT_SEARCH_TERM:
      return action.searchTerm
    default:
      return state
  }
}

// A map of search term -> the result of 'searchResults'
function searchResultsByTerm(state = {}, action) {
  switch(action.type) {
    case PERFORM_SEARCH_REQUEST:
    case PERFORM_SEARCH_SUCCESS:
    case PERFORM_SEARCH_FAILURE:
      return Object.assign({}, state, {
        [action.searchTerm]: searchResults(state[action.searchTerm], action)
      })
    default:
      return state
  }
}

const reducers = combineReducers({
  domains,
  errors,
  filterText,
  languages,
  newString,
  routing: routeReducer,
  searchResultsByTerm,
  searchTerm,
  selectedDomain,
  selectedLanguage,
  selectedString,
  stringsByDomain
})

export default reducers
