import React, { Component, PropTypes } from 'react'
import String from './String'

export default class StringList extends Component {
    render() {
        const {
          editLanguage,
          onEditCancel,
          onEditChange,
          onEditSave,
          onLanguageChange,
          onSelect,
          onStringDelete,
          onTranslationDelete,
          selectedString,
          strings
        } = this.props
        
        return (
          <div>
            {strings.map((s, index) =>
              <String {...s}
                      allowSave={selectedString.isDirty && !selectedString.isUpdating}
                      editLanguage={editLanguage}
                      editorContent={s.name === selectedString.name ? selectedString.content : undefined}
                      error={s.name === selectedString.name ? selectedString.error : undefined}
                      key={index}
                      onCancel={onEditCancel}
                      onChange={onEditChange}
                      onLanguageChange={onLanguageChange}
                      onSave={onEditSave}
                      onSelect={onSelect}
                      onStringDelete={onStringDelete}
                      onTranslationDelete={onTranslationDelete} />
            )}
          </div>
        )
    }
}

StringList.PropTypes = {
    strings: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        translations: PropTypes.object.isRequired
    }).isRequired).isRequired,
    editLanguage: PropTypes.string.isRequired,
    onEditCancel: PropTypes.func.isRequired,
    onEditChange: PropTypes.func.isRequired,
    onEditSave: PropTypes.func.isRequired,
    onLanguageChange: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    onStringDelete: PropTypes.func.isRequired,
    onTranslationDelete: PropTypes.func.isRequired,
    selectedString: PropTypes.shape({
        name: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        isDirty: PropTypes.string.isRequired
    }).isRequired
}