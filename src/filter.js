import React from 'react'
import ReactUpdate from 'react-addons-update'
import {DropdownButton, Form, FormControl, ControlLabel, MenuItem, FormGroup, HelpBlock, Checkbox} from 'react-bootstrap'
import classnames from 'classnames'
import _ from 'underscore'
import {humanize} from 'underscore.string'
import Condition, { ConditionTypes } from './conditions/meteor'
import moment from 'moment'

export default class Filter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      conditionType: null,
      conditionValue: "",
      from_date: "",
      to_date: ""
    }    
    this.conditionValueChanged = this.conditionValueChanged.bind(this)
    this._getValue = this._getValue.bind(this)
    this._formControlFromFieldKey = this._formControlFromFieldKey.bind(this)
    this._valueFromInput = this._valueFromInput.bind(this)
    this._validateInput = this._validateInput.bind(this)
  }

  _getValue(fieldKey, val) {
    const fieldDef = this.props.itemSchema[fieldKey]

    switch (fieldDef.type) {
      case Number:
        return parseFloat(val)      
      default:
        return val
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

  _validateInput(fieldKey, itemFilter){
    const fieldDef = this.props.itemSchema[fieldKey]
    const value = itemFilter[fieldKey]    
    switch (fieldDef.type) {
      case Date:        
        if (value.from_date != "" && value.to_date != ""){
          if (value.to_date < value.from_date){
            return "To Date should be greater than From Date."
          }
        }
      break;  
      case String:
        if(!((/^[a-zA-Z]+$/).test(value))){
          return "Enter alphabets only."
        }
      break;
      default:
        return this.props.validator.fieldError(fieldKey, itemFilter)
      break;  
    }
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
    let value = this._valueFromInput(this.props.field, e)    
    if (e.target.type == "date"){
      if (e.target.name == "from_date"){
        this.setState({from_date: value})        
      }else{
        this.setState({to_date: value})        
      }      
      value = { from_date: document.querySelector("input[name='from_date']").value , to_date: document.querySelector("input[name='to_date']").value }
    }
    this.setState({conditionValue: value})
    this.props.onFilter({[this.props.field]: {[this.state.conditionType]: true, value: value }})
  }

   _formControlFromFieldKey(fieldKey, conditionValueChanged) {    
    const fieldDef = this.props.itemSchema[fieldKey]    
    const controlProps = {      
      onChange: conditionValueChanged,
      placeholder: `Only show if ${humanize(this.state.conditionType)}...`
    }    
    switch (fieldDef.type) {
      case Boolean:
        return (<Checkbox defaultValue={this.state.conditionValue} {...controlProps} />)
        break;
      case Date:
        return (
            <div>
              <FormControl type="date" defaultValue={moment(this.state.from_date).format('YYYY-MM-DD')} onChange={conditionValueChanged} placeholder ="From date" name="from_date"/>
              <FormControl type="date" defaultValue={moment(this.state.to_date).format('YYYY-MM-DD')} onChange={conditionValueChanged} placeholder ="To date" name="to_date"/>
            </div>  
          )
        break;  
      default:
        return (<FormControl type="text" defaultValue={this.state.conditionValue} {...controlProps} />)
        break;  
    }
  }

  render() {
    const color = this.state.conditionType ? '#1b95e0' : 'black'
    const conditionDef = ConditionTypes[this.state.conditionType]

    let valueControl    
    if (this.state.conditionType && conditionDef.valueType) {
      let fieldError = ""      
      if( this.state.conditionValue != "" ){
        const value = this._getValue(this.props.field, this.state.conditionValue)
        let itemFilter =  {}
        itemFilter[this.props.field] =value
        fieldError = this._validateInput(this.props.field, itemFilter)
      }
      
      valueControl = (

        <form style={{marginTop: 10}}>
          <FormGroup key={this.props.field} controlId={this.props.field} validationState={fieldError ? 'error' : 'success'}>
            {this._formControlFromFieldKey(this.props.field, this.conditionValueChanged)}            
            {fieldError && <HelpBlock>{fieldError}</HelpBlock>}
          </FormGroup>          
        </form>
      )
    }

    return (
      <span>
        <DropdownButton
          id={`${this.props.field}FilterMenu`}
          bsSize="small"
          className="columnFilter"
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
        {valueControl}
      </span>
    )
  }
}

Filter.propTypes = {
  field: React.PropTypes.string.isRequired,
  onFilter: React.PropTypes.func.isRequired,
}
