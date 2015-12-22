import React, { Component, PropTypes } from 'react'

const EDIT = 'EDIT'
const NON_EDIT = 'NON_EDIT'

export default class StringAdder extends Component {
    constructor(props) {
        super(props)
        
        this.handleEditStart = this.handleEditStart.bind(this)
        this.handleEditCancel = this.handleEditCancel.bind(this)
        this.handleContentChange = this.handleContentChange.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }
    
    handleEditStart(e) {
        e.preventDefault()
        this.props.onEditStart()
    }
    
    handleEditCancel(e) {
        e.preventDefault()
        this.props.onEditCancel()
    }
    
    handleContentChange(e) {
        this.props.onChange('content', e.target.value)
    }
    
    handleNameChange(e) {
        this.props.onChange('name', e.target.value)
    }
    
    handleSave(e) {
        e.preventDefault()
        this.props.onSave()
    }
  
    render() {
        const {
          name,
          content,
          error,
          isEditing,
          isSaving
        } = this.props
        const mode = isEditing ? EDIT : NON_EDIT
        
        return (
          <div className="row">
            
            { mode === NON_EDIT && 
              <div className="col-md-12">
                <form onSubmit={this.handleEditStart}>
                    <button className="btn btn-default">New string</button>
                </form>
              </div>
            }
            
            { mode === EDIT && 
              <div className="col-md-6">
                {error && 
                  <div className="alert alert-warning">{error.message}</div>
                }
                <form onSubmit={this.handleSave}>
                  <div className="form-group">
                    <label htmlFor="add-string-name">New string name</label>
                    <input className="form-control"
                           id="add-string-name"
                           type="text"
                           onChange={this.handleNameChange} 
                           value={name} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="add-string-content">New string content</label>
                    <textarea className="form-control"
                           id="add-string-content"
                           onChange={this.handleContentChange}
                           rows="10"
                           value={content}></textarea>
                  </div>
                  <button className="btn btn-primary btn-space-right"
                          disabled={isSaving}>Save</button>
                  <button className="btn btn-default"
                          onClick={this.handleEditCancel}>Cancel</button>
                </form>
              </div>
            }
          </div>
        )
    }
}

StringAdder.PropTypes = {
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    error: PropTypes.instanceOf(Error),
    isEditing: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    onEditStart: PropTypes.func.isRequired,
    onEditCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
}