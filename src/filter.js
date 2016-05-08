import React from 'react'
import ReactUpdate from 'react-addons-update'
import {DropdownButton, FormGroup, FormControl, ControlLabel, MenuItem} from 'react-bootstrap'
import classnames from 'classnames'
import _ from 'underscore'
import {humanize} from 'underscore.string'
import Condition, { ConditionTypes } from './mongo/condition'

export default class Filter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      conditionType: null,
      conditionValue: "",
    }

    this.conditionValueChanged = this.conditionValueChanged.bind(this)
  }

  conditionToggled(conditionType) {
    let newState;

    if (this.state.conditionType === conditionType) {
      newState = { conditionType: null, conditionValue: "" }
    } else {
      newState = { conditionType: conditionType }
    }

    this.setState(newState)
    this.props.onFilter({[this.props.field]: {[conditionType]: !!newState.conditionType}})
  }

  conditionValueChanged(e) {
    const value = e.target.value

    this.setState({conditionValue: value})
    this.props.onFilter({[this.props.field]: {[this.state.conditionType]: true, value: value}})
  }

  render() {
    const color = this.state.conditionType ? '#1b95e0' : 'black'
    const conditionDef = ConditionTypes[this.state.conditionType]

    let valueControl

    if (this.state.conditionType && conditionDef.valueType) {
      valueControl = (
        <FormGroup id={`${this.props.field}-${this.state.conditionType}`}>
          <ControlLabel>{humanize(this.state.conditionType)}</ControlLabel>
          {' '}
          <FormControl type="text"
            value={this.state.conditionValue}
            onChange={this.conditionValueChanged}
          />
        </FormGroup>
      )
    }

    return (
      <span>
        <DropdownButton
          id={`${this.props.field}FilterMenu`}
          bsSize="small"
          noCaret
          style={{marginLeft: 10}}
          title={<span className="fa fa-filter" style={{color: color}} />}>
          {_.map(ConditionTypes, (conditionDef, conditionType) => {
            const conditionEnabled = this.state.conditionType === conditionType
            let checkMark

            if (conditionEnabled) {
              checkMark = (<span className="fa fa-check" style={{color: color, marginLeft: 2}} />)
            }

            return (
              <MenuItem
                key={conditionType}
                onSelect={this.conditionToggled.bind(this, conditionType)}>
                {humanize(conditionType)} {checkMark}
              </MenuItem>
            )
          })}
        </DropdownButton>
        {' '}
        {valueControl}
      </span>
    )
  }
}

Filter.propTypes = {
  field: React.PropTypes.string.isRequired,
  onFilter: React.PropTypes.func.isRequired,
}
