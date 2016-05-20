import React, { Component } from 'react'
import { Button, ControlLabel, Form, FormControl, FormGroup, Modal } from 'react-bootstrap'
import _ from 'underscore'
import { humanize, titleize } from 'underscore.string'

export default class ItemEditor extends Component {
  _formControlTypeFromFieldDef(fieldDef) {
    switch (fieldDef.type) {
      case String:
        return 'text'
        break
      case Date:
        return 'date'
        break
      default:
        return 'text'
    }
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
                  <FormControl autoFocus={field === firstField} type={type} />
                  <FormControl.Feedback />
                </FormGroup>
              )
            })}
            <Button>Save</Button>
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
