import React, { Component, PropTypes } from 'react'

export default class SearchResult extends Component {
  constructor(props) {
    super(props)
    this.handleSelect = this.handleSelect.bind(this)
  }
  
  handleSelect() {
    const {onSelect, stringName, domainName, languageCode} = this.props
    onSelect(domainName, stringName, languageCode)
  }
  
  render() {
    const {
      stringName, 
      domainName,
      languageCode,
      translationContent
    } = this.props
      
    return (
      <div className="panel panel-default clickable"
           onClick={this.handleSelect}>
        <div className="panel-heading">
          <h3 className="panel-title">{domainName}.{stringName} ({languageCode})</h3>
        </div>
        <div className="panel-body">
          {translationContent}
        </div>
      </div>
    )
  }
}

SearchResult.PropTypes = {
  stringName: PropTypes.string.isRequired,
  domainName: PropTypes.string.isRequired,
  languageCode: PropTypes.string.isRequired,
  translationContent: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}