import React, { Component, PropTypes } from 'react'

export default class Exporter extends Component {
    constructor(props) {
        super(props)
        
        this.confirmExportAll = this.confirmExportAll.bind(this)
    }
    
    render() {
        return (
            <div className="form-group">
                <p className="fake-label">Export to XML files</p>
                <button className="btn btn-default btn-space-right"
                        onClick={this.props.onExportSelected}>Export domain</button>
                <button className="btn btn-default"
                        onClick={this.confirmExportAll}>Export all</button>
            </div>
        )
    }
    
    confirmExportAll() {
        if (window.confirm("This will export ALL translations from ALL domains to XML.\n\nAre you sure?\n\nIf you don't know what this message means - you're not! ;)")) {
            this.props.onExportAll()
        }
    }
}

Exporter.propTypes = {
    onExportSelected: PropTypes.func.isRequired,
    onExportAll: PropTypes.func.isRequired
}