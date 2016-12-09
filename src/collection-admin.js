import React from 'react'
import ReactUpdate from 'react-addons-update'
import {Button, ButtonToolbar, Checkbox, Panel, Table} from 'react-bootstrap'
import _ from 'underscore'
import {humanize} from 'underscore.string'

import GroupSelector from './group-selector'
import Sorter from './sorter'
import Filter from './filter'
import Condition, { ConditionTypes } from './conditions/meteor'
import ItemEditor from './item-editor'

export default class CollectionAdmin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedItemIds: [],
      itemFilter: {},
      fetchOptions: {sort: {}},
      newItemIsOpen: false,
      editingItemId: null,
      item: {}
    }

    this.isItemSelected = this.isItemSelected.bind(this)
    this.filteredAndSortedItems = this.filteredAndSortedItems.bind(this)
    this.onSort = this.onSort.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.newItem = this.newItem.bind(this)
    this.closeNewItem = this.closeNewItem.bind(this)
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

  columns() {
    return _.keys(this.props.itemSchema)
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

  newItem() {
    this.setState({editingItemId: null, newItemIsOpen: true, item: {}})
  }

  closeNewItem() {
    this.setState({newItemIsOpen: false})
  }

  editItem(item) {    
    this.setState({editingItemId: item._id, newItemIsOpen: true, item: item})
  }

  render() {
    const items = this.filteredAndSortedItems()
    const itemIds = _.pluck(items, '_id')
    const columns = this.columns()
    const controls = (
      <ButtonToolbar>
        <Button onClick={this.newItem}>New</Button>
        <ItemEditor
          {...this.props}
          item = {this.state.item}
          isNew = {this.state.editingItemId ? false : true}
          show={this.state.newItemIsOpen}
          onHide={this.closeNewItem} />
      </ButtonToolbar>
    )

    return (
      <Panel header={controls}>
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
              {_.map(columns, (column, i) => {
                return (
                  <th key={i}>
                    <Sorter ref={`${column}Sorter`} field={column} onSort={this.onSort}>
                      {humanize(column)}
                    </Sorter>
                    <Filter ref={`${column}Filter`} field={column} onFilter={this.onFilter}/>
                  </th>
                )
              })}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {_.map(items, (item, i) => {              
              return (
                <tr className="item" key={i}>
                  <td style={{width: 25, verticalAlign: "middle", textAlign: "center"}}>
                    <Checkbox
                      className="itemSelector"
                      checked={this.isItemSelected(item._id)}
                      onChange={this.onItemSelected.bind(this, item._id)}
                    />
                  </td>
                  {_.map(columns, (column, j) => {
                    return (
                      <td style={{verticalAlign: "middle"}} key={j} className={column}>
                        {item[column]}
                      </td>
                    )
                  })}
                  <td>
                    <Button onClick={this.editItem.bind(this, item)}>Edit</Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Panel>
    )
  }
}

CollectionAdmin.propTypes = {  
  loading: React.PropTypes.bool,
  itemType: React.PropTypes.string.isRequired,
  itemSchema: React.PropTypes.object.isRequired,
  fetchItems: React.PropTypes.func.isRequired,
  addItem: React.PropTypes.func.isRequired,
  updateItem: React.PropTypes.func.isRequired
}
