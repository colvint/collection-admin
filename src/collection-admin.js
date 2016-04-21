import React from 'react';
import _ from 'underscore';
import {humanize} from 'underscore.string';
import {
  Table,
  Checkbox,
  DropdownButton,
  MenuItem,
} from 'react-bootstrap';

// class GroupSelector extends React.Component {
//   render() {
//     return
//   }
// }

export default class CollectionAdmin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItemIds: []
    };
  }

  fields() {
    return _.keys(_.first(this.props.items));
  }

  headers() {
    return _.without(this.fields(), '_id', 'id');
  }

  onItemSelected(itemId) {
    let selectedItemIds = this.state.selectedItemIds;
    const itemPosition  = this.state.selectedItemIds.indexOf(itemId);

    if (itemPosition === -1) {
      // select the  item
      selectedItemIds.push(itemId);
    } else {
      // de-select the item
      selectedItemIds.splice(itemPosition, 1);
    }
    this.setState({
      selectedItemIds: selectedItemIds
    });
  }

  render() {
    const items = this.props.items;
    const headers = this.headers();

    const groupSelector = (
      <DropdownButton
        id="groupSelector"
        bsSize="small"
        noCaret
        title={<span className="fa fa-list"></span>}>
        <MenuItem eventKey="all">All</MenuItem>
        <MenuItem eventKey="none">None</MenuItem>
        <MenuItem eventKey="inverse">Inverse</MenuItem>
      </DropdownButton>
    );

    return (
      <Table className="table table-bordered table-striped table-hover">
        <thead>
          <tr>
            <th>{groupSelector}</th>
            {_.map(headers, (header, i) => {
              return (
                <th key={i} className="header">
                  {humanize(header)}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {_.map(items, (item, i) => {
            return (
              <tr className="item" key={i}>
                <td>
                  <Checkbox
                    className="itemSelector"
                    checked={_.contains(this.state.selectedItemIds, item._id)}
                    onChange={this.onItemSelected.bind(this, item._id)}
                  />
                </td>
                {_.map(headers, (header, j) => {
                  return (
                    <td key={j} className={header}>
                      {item[header]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}

CollectionAdmin.propTypes = {
  items: React.PropTypes.array.isRequired,
  loading: React.PropTypes.bool,
};
