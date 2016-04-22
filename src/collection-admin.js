import React from 'react';
import _ from 'underscore';
import {humanize} from 'underscore.string';
import {
  Table,
  Checkbox,
} from 'react-bootstrap';
import GroupSelector from './group-selector.js';

export default class CollectionAdmin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItemIds: []
    };

    this.isItemSelected = this.isItemSelected.bind(this);
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

    this.updateSelectedItems(selectedItemIds);
  }

  isItemSelected(itemId) {
    return _.contains(this.state.selectedItemIds, itemId);
  }

  updateSelectedItems(selectedItemIds) {
    this.setState({
      selectedItemIds: selectedItemIds
    });
  }

  render() {
    const items = this.props.items;
    const allItemIds = _.pluck(items, '_id');
    const headers = this.headers();

    return (
      <Table className="table table-bordered table-striped table-hover">
        <thead>
          <tr>
            <th>
              <GroupSelector
                allItemIds={allItemIds}
                selectedItemIds={this.state.selectedItemIds}
                onSelected={this.updateSelectedItems.bind(this)}
              />
            </th>
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
                    checked={this.isItemSelected(item._id)}
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
