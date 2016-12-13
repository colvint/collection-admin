import React, { Component } from 'react'
import update from 'react-addons-update'
import {
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  HelpBlock,
  Modal
} from 'react-bootstrap'
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
              const fieldError = this.props.validator.fieldError(field, this.state.item)
              let validationState
              let validationMessage

              if (fieldError) {
                validationState = 'error'
                validationMessage = (<HelpBlock>{fieldError}</HelpBlock>)
              } else {
                validationState = 'success'
              }

              return (
                <FormGroup key={field} controlId={field} className={field != 'isArchive' ? '' : 'hidden'} validationState={validationState}>
                  <ControlLabel>{humanize(field)}</ControlLabel>
                  <FormControl autoFocus={field === firstField} type={field != 'isArchive' ? type : 'hidden'} onChange={this.handleFieldChange.bind(this, field)} defaultValue={this.props.item[field]} />
                  {validationMessage}
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
}
