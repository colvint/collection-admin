import React from 'react'
import ReactUpdate from 'react-addons-update'
import {Table, Checkbox} from 'react-bootstrap'
import _ from 'underscore'
import {humanize} from 'underscore.string'

import GroupSelector from './group-selector.js'
import Sorter from './sorter.js'
import Filter from './filter.js'
import Condition, { ConditionTypes } from './mongo/condition.js'

export default class CollectionAdmin extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedItemIds: [],
      itemFilter: {},
      fetchOptions: {sort: {}},
    }

    this.isItemSelected = this.isItemSelected.bind(this)
    this.onSort = this.onSort.bind(this)
    this.onFilter = this.onFilter.bind(this)
  }

  fields() {
    return _.keys(_.first(this.allItems()))
  }

  headers() {
    return _.without(this.fields(), '_id', 'id')
  }

  onItemSelected(itemId) {
    let selectedItemIds = this.state.selectedItemIds
    const itemPosition  = this.state.selectedItemIds.indexOf(itemId)

    if (itemPosition === -1) {
      // select the  item
      selectedItemIds.push(itemId)
    } else {
      // de-select the item
      selectedItemIds.splice(itemPosition, 1)
    }

    this.updateSelectedItems(selectedItemIds)
  }

  isItemSelected(itemId) {
    return _.contains(this.state.selectedItemIds, itemId)
  }

  updateSelectedItems(selectedItemIds) {
    this.setState({
      selectedItemIds: selectedItemIds
    })
  }

  allItems() {
    return this.props.fetchItems()
  }

  filteredAndSortedItems() {
    return this.props.fetchItems(
      this.state.itemFilter,
      this.state.fetchOptions
    )
  }

  onSort(sortSpecifier = {}) {
    const field = _.keys(sortSpecifier)[0]
    let sort = this.state.fetchOptions.sort

    if (_.isNull(sortSpecifier[field])) {
      delete sort[field]
      sort = ReactUpdate(sort, {$set: sort})
    } else {
      sort = ReactUpdate(sort, {$merge: sortSpecifier})
    }

    const fetchOptions = ReactUpdate(this.state.fetchOptions, {$merge: {sort: sort}})

    this.setState({fetchOptions: fetchOptions})
  }

  onFilter(conditionSpecifier) {
    const field = _.keys(conditionSpecifier)[0]
    const conditionType = _.keys(conditionSpecifier[field])[0]
    const conditionEnabled = conditionSpecifier[field][conditionType]
    let itemFilter = this.state.itemFilter
    let condition

    if (conditionEnabled) {
      condition = new Condition(field, conditionSpecifier[field].value)
      itemFilter = ReactUpdate(itemFilter, {$merge: condition[conditionType]()})
    } else{
      delete itemFilter[field]
    }
    this.setState({itemFilter: itemFilter})
  }

  render() {
    const items = this.filteredAndSortedItems()
    const itemIds = _.pluck(items, '_id')
    const headers = this.headers()

    return (
      <Table className="table table-bordered table-striped table-hover">
        <thead>
          <tr>
            <th>
              <GroupSelector
                allItemIds={itemIds}
                selectedItemIds={this.state.selectedItemIds}
                onSelected={this.updateSelectedItems.bind(this)}
              />
            </th>
            {_.map(headers, (header, i) => {
              return (
                <th key={i}>
                  <Sorter ref={`${header}Sorter`} field={header} onSort={this.onSort}>
                    {humanize(header)}
                  </Sorter>
                  <Filter ref={`${header}Filter`} field={header} onFilter={this.onFilter}/>
                </th>
              )
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
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </Table>
    )
  }
}

CollectionAdmin.propTypes = {
  fetchItems: React.PropTypes.func.isRequired,
  loading: React.PropTypes.bool,
}
