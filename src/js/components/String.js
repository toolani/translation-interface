import React, { Component, PropTypes } from 'react'

const EDIT = 'edit'
const DISPLAY = 'display'

export default class String extends Component {
  constructor(props) {
    super(props)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSelection = this.handleSelection.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }
  
  handleCancel(e) {
    e.preventDefault()
    this.props.onCancel()
  }
  
  // Handles changes of the translation string that is currently being edited
  handleChange(e) {
    this.props.onChange(e.target.value)
  }
  
  // Selects a translation to edit
  handleSelection(e) {
    e.preventDefault()
    
    const { editLanguage, name, onSelect } = this.props
    
    if (editLanguage !== "") {
      onSelect(name)
    }
  }
  
  // Saves the translation that is currently being edited
  handleSave(e) {
    e.preventDefault()
    this.props.onSave()
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    const { allowSave, editorContent, editLanguage, error, name, translations } = this.props
    
    if (nextProps.allowSave !== allowSave ||
        nextProps.editorContent !== editorContent ||
        nextProps.editLanguage !== editLanguage ||
        nextProps.error !== error ||
        nextProps.name !== name) {
      return true
    }
    
    if (nextProps.translations.length !== translations.length) {
      return true
    }
    
    for (var i = 0 i<nextProps.translations.length i++) {
      if (nextProps.translations[i].language !== translations[i].language ||
        nextProps.translations[i].content !== translations[i].content) {
        return true
      }
    }
    
    return false
  }
  
  render() {
    const { allowSave, editorContent, editLanguage, error, name, onSelect, translations } = this.props
    const selectedTranslation = translations.find(t => t.language === editLanguage) || {
      language: editLanguage,
      content: '',
      isNonExistent: true
    }
    const otherTranslations = translations.filter(t => t.language !== editLanguage)
    const mode = editorContent !== undefined ? EDIT : DISPLAY
    
    return (
      <div className="row">
        <div className="col-md-12">
          <h3 className="clickable"
              onClick={this.handleSelection}>{name}</h3>
        </div>
        
        <div className="col-md-6">
          {mode === EDIT &&
            <form onSubmit={this.handleSave}>
              <div className="form-group">
                <textarea className="form-control" 
                          name="current-translation" 
                          onChange={this.handleChange}
                          rows="10" 
                          value={editorContent}>
                </textarea>
              </div>
              {error && 
                <div className="alert alert-warning">{error.message}</div>
              }
              <button className="btn btn-primary btn-space-right"
                      disabled={!allowSave}>Save</button> 
              <button className="btn btn-default"
                      onClick={this.handleCancel}>Cancel</button>
            </form>
          }
          
          { mode === DISPLAY && selectedTranslation.isNonExistent && 
            <button className="btn btn-default btn-info btn-lg btn-full-width"
                    onClick={this.handleSelection}>Translate</button>
          }
          
          { mode === DISPLAY && !selectedTranslation.isNonExistent &&
            <div>
              <p className="clickable"
                 onClick={this.handleSelection}>
                {selectedTranslation.content}
              </p>
              <p><button className="btn btn-default btn-sm"
                         onClick={this.handleSelection}>Edit</button></p>
            </div>
          }
        </div>
        
        <div className="col-md-6">
          <div className="panel panel-default">
            <div className="panel-body">
              { !otherTranslations.length && 
                <p className="text-muted">No translations</p>
              }
              
              {otherTranslations.map((trans, index) => 
                <div key={trans.language}>
                  <p>
                    <strong>{trans.language}</strong><br/>
                    {trans.content}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

String.propTypes = {
  allowSave: PropTypes.bool,
  editorContent: PropTypes.string,
  editLanguage: PropTypes.string.isRequired,
  error: PropTypes.instanceOf(Error),
  name: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  translations: PropTypes.arrayOf(
    PropTypes.shape({
      language: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired
    })
  ).isRequired
}