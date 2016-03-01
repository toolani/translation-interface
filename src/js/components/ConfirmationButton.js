import React, { Component, PropTypes } from 'react'

/**
 * A button that requires the user to provide confirmation before
 * performing its action.
 * 
 * Requires these props:
 * 
 * - onConfirmation: Function to call when the action is confirmed.
 * - labelButton: The label to show on the initial button.
 * 
 * These props are optional:
 * 
 * - labelConfirm: The label to show on the 'confirm' button after clicking the initial button.
 * - labelCancel: Like labelConfirm, but for the 'cancel' button.
 */
export default class ConfirmationButton extends Component {
    
    constructor(props) {
        super(props)
        this.handleButtonClick = this.handleButtonClick.bind(this)
        this.handleConfirmation = this.handleConfirmation.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        
        this.state = {
            isConfirming: false
        }
    }
    
    handleButtonClick(e) {
        e.preventDefault()
        this.setState({
            isConfirming: true
        })
    }
    
    handleConfirmation(e) {
        e.preventDefault()
        this.props.onConfirmation()
        this.setState({
            isConfirming: false
        })
    }
    
    handleCancel(e) {
        e.preventDefault()
        this.setState({
            isConfirming: false
        })
    }
    
    render() {
        const {isConfirming} = this.state
        const {className, labelButton} = this.props
        const labelConfirm = this.props.labelConfirm ? this.props.labelConfirm : "Yes"
        const labelCancel = this.props.labelCancel ? this.props.labelCancel : "No"
        
        return (
            <div className="confirmation-btn">
            { !isConfirming && 
                <button className={className}
                        onClick={this.handleButtonClick}>{labelButton}</button>
            }
            
            { isConfirming &&
                <div className="confirm-btns">
                    <button className={className}
                            onClick={this.handleConfirmation}>{labelConfirm}</button>
                
                    <button className="btn btn-default btn-sm"
                            onClick={this.handleCancel}>{labelCancel}</button>
                </div>
            }
            </div>
        )
    }
}

ConfirmationButton.PropTypes = {
    labelButton: PropTypes.string.isRequired,
    labelCancel: PropTypes.string,
    labelConfirm: PropTypes.string,
    onConfirmation: PropTypes.func.isRequired
}