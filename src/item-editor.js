import React, { Component } from 'react'
import update from 'react-addons-update'
import { Button, ControlLabel, Form, FormControl, FormGroup, Modal } from 'react-bootstrap'
import _ from 'underscore'
import { humanize, titleize } from 'underscore.string'

export default class ItemEditor extends Component {

  constructor(props) {
    super(props)    
    this.handleSave = this.handleSave.bind(this)
  }

  componentWillReceiveProps(nextProps){
    this.state = { item: nextProps.item }
  }

  _formControlTypeFromFieldDef(fieldDef) {
    switch (fieldDef.type) {
      case Date:
        return 'date'
        break
      default:
        return 'text'
    }
  }

  handleFieldChange(fieldKey, e) {
    const updatedItem = update(this.state.item, { $merge: { [fieldKey]: e.target.value } })
    this.setState({ item: updatedItem })
  }

  handleSave() {
    if(this.props.isNew) {
      this.props.addItem(this.state.item)
    } else {      
      this.props.updateItem(this.props.item, this.state.item)
    }

    this.props.onHide()
  }

  render() {
    const title = titleize(`${this.props.isNew ? 'New' : 'Editing'} ${this.props.itemType}`)
    const firstField = Object.keys(this.props.itemSchema)[0]
    return (      
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {_.map(this.props.itemSchema, (fieldDef, field) => {              
              const type = this._formControlTypeFromFieldDef(fieldDef)
              return (
                <FormGroup key={field} controlId={field}>
                  <ControlLabel>{humanize(field)}</ControlLabel>
                  <FormControl autoFocus={field === firstField} type={type} onChange={this.handleFieldChange.bind(this, field)} defaultValue={this.props.item[field]} />
                  <FormControl.Feedback />
                </FormGroup>
              )
            })}
            <Button id="saveBtn" onClick={this.handleSave}>Save</Button>
          </Form>
        </Modal.Body>
      </Modal>
    )
  }
}

ItemEditor.propTypes = {
  item: React.PropTypes.object,
  itemValidator: React.PropTypes.shape({
    validationMessage: React.PropTypes.func.isRequired,
    isItemValid: React.PropTypes.func.isRequired,
    isFieldValue: React.PropTypes.func.isRequired,
  }),
  isNew: React.PropTypes.bool.isRequired,
  show: React.PropTypes.bool.isRequired,
  onHide: React.PropTypes.func.isRequired,
}

ItemEditor.defaultProps = {
  item: {},
  isNew: false,
  show: false,
}
