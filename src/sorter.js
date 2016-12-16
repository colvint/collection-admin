import React from 'react'
import classnames from 'classnames'

export default class Sorter extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      direction: null,
    }

    this.toggleSort = this.toggleSort.bind(this)
  }

  toggleSort() {
    let direction

    if (this.state.direction === 1) {
      direction = -1
    } else if (this.state.direction === -1) {
      direction = null
    } else {
      direction = 1
    }

    this.setState({direction: direction})

    this.props.onSort({[this.props.field]: direction})
  }

  render() {
    const iconKlasses = {
      'fa-sort': (this.state.direction === null),
      'fa-sort-up': (this.state.direction === 1),
      'fa-sort-down': (this.state.direction === -1),
    }

    return (
      <span style={{cursor: "pointer"}} onClick={this.toggleSort} className="column-sorter">
        <span className={classnames('fa', iconKlasses)} style={{marginRight: 5}} />
        {this.props.children}
      </span>
    )
  }
}

Sorter.propTypes = {
  field: React.PropTypes.string.isRequired,
  onSort: React.PropTypes.func.isRequired,
}
