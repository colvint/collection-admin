import React, { Component } from 'react'
import update from 'react-addons-update'
import { Button, Checkbox, ControlLabel, Form, FormControl, FormGroup, HelpBlock, Modal} from 'react-bootstrap'
import _ from 'underscore'
import { humanize, titleize } from 'underscore.string'
import moment from 'moment'

export default class ItemEditor extends Component {

  constructor(props) {
    super(props)

    this.handleSave = this.handleSave.bind(this)
    this._formControlFromFieldKey = this._formControlFromFieldKey.bind(this)

    this.state = {
      item: props.item
    }
  }

  _formControlFromFieldKey(fieldKey) {
    const fieldDef = this.props.itemSchema[fieldKey]
    const fieldValue = this.state.item[fieldKey]
    const isFirstField = Object.keys(this.props.itemSchema)[0] === fieldKey
    const controlProps = {
      autoFocus: isFirstField,
      onChange: this.handleFieldChange.bind(this, fieldKey),
      placeholder: `Enter ${humanize(fieldKey)}`
    }

    switch (fieldDef.type) {
      case Boolean:
        return (<Checkbox defaultChecked={fieldValue} {...controlProps} />)
      case Date:
        return (<FormControl type="date" defaultValue={moment(fieldValue).format('YYYY-MM-DD')} {...controlProps} />)
      default:
        return (<FormControl type="text" defaultValue={fieldValue} {...controlProps} />)
    }
  }

  _valueFromInput(fieldKey, e) {
    const fieldDef = this.props.itemSchema[fieldKey]

    switch (fieldDef.type) {
      case Boolean:
        return e.target.checked
      case Number:
        return parseFloat(e.target.value)
      case Date:
        return moment(e.target.value, 'YYYY-MM-DD').toDate()
      default:
        return e.target.value
    }    
  }

  handleFieldChange(fieldKey, e) {
    const value = this._valueFromInput(fieldKey, e)
    const updatedItem = update(this.state.item, { $merge: { [fieldKey]: value } })

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

    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {_.map(this.props.itemSchema, (fieldDef, field) => {
              const fieldError = this.props.validator.fieldError(field, this.state.item)

              return (
                <FormGroup key={field} controlId={field} validationState={fieldError ? 'error' : 'success'}>
                  <ControlLabel>{humanize(field)}</ControlLabel>
                  {this._formControlFromFieldKey(field)}
                  {fieldError && <HelpBlock>{fieldError}</HelpBlock>}
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
  validator: React.PropTypes.object,
  isNew: React.PropTypes.bool,
  show: React.PropTypes.bool,
  itemType: React.PropTypes.string.isRequired,
  itemSchema: React.PropTypes.object.isRequired,
  onHide: React.PropTypes.func.isRequired,
  addItem: React.PropTypes.func.isRequired,
  updateItem: React.PropTypes.func.isRequired,
}

ItemEditor.defaultProps = {
  item: {},
  isNew: false,
  show: false,
  validator: {
    fieldError: () => false,
    isItemValid: () => true
  }
}
