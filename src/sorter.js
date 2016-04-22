import React from 'react';
import classnames from 'classnames';

export default class Sorter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      direction: null,
    }

    this.toggleSort = this.toggleSort.bind(this);
  }

  toggleSort() {
    let direction;

    if (this.state.direction === 1) {
      direction = -1;
    } else if (this.state.direction === -1) {
      direction = null;
    } else {
      direction = 1;
    }

    this.setState({direction: direction});

    if (direction) {
      this.props.onSort({[this.props.field]: direction});
    } else {
      this.props.onSort({});
    }
  }

  render() {
    const iconKlasses = {
      'fa-sort-up': (this.state.direction == 1),
      'fa-sort-down': (this.state.direction == -1),
    };
    return (
      <span
        className={classnames('fa', iconKlasses)}
        onClick={this.toggleSort}
      />
    );
  }
}

Sorter.propTypes = {
  field: React.PropTypes.string,
  onSort: React.PropTypes.func.isRequired,
}
