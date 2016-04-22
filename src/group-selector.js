import React from 'react';
import _ from 'underscore';
import {
  DropdownButton,
  MenuItem,
} from 'react-bootstrap';

export default class GroupSelector extends React.Component {
  selectAll() {
    this.props.onSelected(this.props.allItemIds);
  }

  selectNone() {
    this.props.onSelected([]);
  }

  selectInverse() {
    const inverseSelectedIds = _.difference(
      this.props.allItemIds,
      this.props.selectedItemIds
    );

    this.props.onSelected(inverseSelectedIds);
  }

  render() {
    return (
      <DropdownButton
        id="groupSelector"
        bsSize="small"
        noCaret
        title={<span className="fa fa-list"></span>}>
        <MenuItem onSelect={this.selectAll}>All</MenuItem>
        <MenuItem onSelect={this.selectNone}>None</MenuItem>
        <MenuItem onSelect={this.selectInverse}>Inverse</MenuItem>
      </DropdownButton>
    );
  }
}

GroupSelector.propTypes = {
  allItemIds: React.PropTypes.array.isRequired,
  selectedItemIds: React.PropTypes.array.isRequired,
  onSelected: React.PropTypes.func.isRequired,
};
