import React from 'react';
import {Table} from 'react-bootstrap';
import _ from 'underscore';
import {humanize} from 'underscore.string';

export default class CollectionAdmin extends React.Component {
  render() {
    const items = this.props.items;
    const headers = _.keys(_.first(items));

    return (
      <Table className="table table-bordered table-striped table-hover">
        <thead>
          <tr>
            {_.map(headers, (header, i) => {
              return (
                <th key={i}>
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
};
