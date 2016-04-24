import React from 'react'
import ReactUpdate from 'react-addons-update'
import {DropdownButton, MenuItem} from 'react-bootstrap'
import classnames from 'classnames'
import _ from 'underscore'
import {humanize} from 'underscore.string'
import {FilterTypes} from './filters/mongo'

export default class Filter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      enabledFilter: null
    }
  }

  toggleFilter(filterType) {
    const enabledFilter = this.state.enabledFilter === filterType ? null : filterType

    this.setState({enabledFilter: enabledFilter})
    this.props.onFilter({[this.props.field]: {[filterType]: !!enabledFilter}})
  }

  render() {
    const color = this.state.enabledFilter ? '#1b95e0' : 'black'

    return (
      <DropdownButton
        id={`${this.props.field}FilterMenu`}
        bsSize="small"
        noCaret
        style={{marginLeft: 10}}
        title={<span className="fa fa-filter" style={{color: color}} />}>
        {_.map(FilterTypes, (filterType, i) => {
          let checkMark

          if (this.state.enabledFilter === filterType) {
            checkMark = (
              <span className="fa fa-check" style={{color: color, marginLeft: 2}} />
            )
          }

          return (
            <MenuItem key={i} onSelect={this.toggleFilter.bind(this, filterType)}>
              {humanize(filterType)}
              {checkMark}
            </MenuItem>
          )
        })}
      </DropdownButton>

    )
  }
}

Filter.propTypes = {
  field: React.PropTypes.string.isRequired,
  onFilter: React.PropTypes.func.isRequired,
}
