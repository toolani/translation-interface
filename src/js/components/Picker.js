import React, { Component, PropTypes } from 'react'

export default class Picker extends Component {
    render() {
        const { labels, disabled, onChange, options, showEmptyOption, title, value } = this.props
        
        if (labels && labels.length !== options.length) {
            throw new Error('Picker needs an equal number of options and labels')
        }
      
        let displayLabels  = labels ? labels : options
        let displayOptions = options
        
        if (showEmptyOption) {
            displayLabels  = ['', ...displayLabels]
            displayOptions = ['', ...displayOptions]
        }
        
        return (
          <div className="form-group">
            {title && 
              <label>{title}</label>
            }
            <select className="form-control"
                    disabled={disabled}
                    onChange={e => onChange(e.target.value)}
                    value={value}>
              {displayOptions.map((option, index) => 
                <option value={option} key={option}>{displayLabels[index]}</option>)
              }
            </select>
          </div>
        )
    }
}

Picker.PropTypes = {
    disabled: PropTypes.bool,
    labels: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ),
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.string.isRequired
    ).isRequired,
    showEmptyOption: PropTypes.bool.isRequired,
    title: PropTypes.string,
    value: PropTypes.string.isRequired
}