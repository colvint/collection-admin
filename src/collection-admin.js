import React from 'react'
import ReactUpdate from 'react-addons-update'
import {Button, ButtonGroup, ButtonToolbar, Checkbox, Panel, Table} from 'react-bootstrap'
import _ from 'underscore'
import {humanize} from 'underscore.string'
import moment from 'moment'
import FontAwesome from 'react-fontawesome'

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
      itemEditorIsOpen: false,
      editingItemId: null,
      item: { isArchive: false },
      items: this.props.fetchItems(),
      archiveItem: false
    }

    this.isItemSelected = this.isItemSelected.bind(this)
    this.filteredAndSortedItems = this.filteredAndSortedItems.bind(this)
    this.onSort = this.onSort.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.newItem = this.newItem.bind(this)
    this.closeNewItem = this.closeNewItem.bind(this)
    this.archiveItem = this.archiveItem.bind(this)
    this.indexItem = this.indexItem.bind(this)
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
    // sort = Object {lastPrice: 1}
    const fetchOptions = ReactUpdate(this.state.fetchOptions, {$merge: {sort: sort}})

    this.setState({fetchOptions: fetchOptions})
  }

  onFilter(conditionSpecifier) {
    const field = _.keys(conditionSpecifier)[0]
    const conditionType = _.keys(conditionSpecifier[field])[0]
    const conditionEnabled = conditionSpecifier[field][conditionType]
    let itemFilter = this.state.itemFilter
    if (conditionEnabled){
      if (conditionType != "textContains"){
        itemFilter[field] =  conditionSpecifier[field]  
      }else if(Object.keys(conditionSpecifier[field]).length != 1){
        itemFilter[field] =  conditionSpecifier[field]
      }
    }else{         
      delete itemFilter[field]
    }     
    this.setState({itemFilter: itemFilter})
  }

  newItem() {
    this.setState({editingItemId: null, itemEditorIsOpen: true, item: {isArchive: false}})
  }

  closeNewItem() {
    this.setState({itemEditorIsOpen: false})
  }

  editItem(item) {
    this.setState({editingItemId: item._id, itemEditorIsOpen: true, item: item})
  }

  archiveItem() {
   this.setState({ archiveItem: true }) 
  }

  indexItem() {
   this.setState({ archiveItem: false }) 
  }

  deleteItem(item) {
    var items = this.props.deleteItem(item)   
    this.setState({ items: items })
  }

  undoItem(item) {
    var items = this.props.undoItem(item)   
    this.setState({ items: items })   
  }

  _renderField(fieldKey, item) {
    const fieldValue = item[fieldKey]
    const fieldDef = this.props.itemSchema[fieldKey]

    switch (fieldDef.type) {
      case Boolean:
        return fieldValue ? (<FontAwesome name="check" />) : null
      case Number:
        return fieldValue
      case Date:
        return moment(fieldValue).format('L')
      default:
        return fieldValue
    }
  }

  render() {
    const items = this.filteredAndSortedItems()
    const itemIds = _.pluck(items, '_id')
    const columns = this.columns()
    const archive = this.state.archiveItem ? true : false
    const controls = (
      <ButtonToolbar>
        <Button onClick={this.newItem}>New</Button>
        <Button onClick={this.indexItem}>Index</Button>
        <Button onClick={this.archiveItem}>Archive</Button>
        <ItemEditor
          {...this.props}
          item = {this.state.item}
          isNew = {this.state.editingItemId ? false : true}
          show={this.state.itemEditorIsOpen}
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
                    <Sorter field={column} onSort={this.onSort}>{humanize(column)}</Sorter>
                    <Filter field={column} onFilter={this.onFilter}/>
                  </th>
                )
              })}
              <th></th>
            </tr>
          </thead>
          <tbody>            
            {_.map(items, (item, i) => {
              if (item.isArchive == archive) {
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
                          {this._renderField(column, item)}
                        </td>
                      )
                    })}
                    <td>
                      <ButtonGroup>
                        <Button onClick={this.editItem.bind(this, item)}>Edit</Button>
                        { !archive ? <Button onClick={this.deleteItem.bind(this, item)} bsStyle="danger">Delete</Button> : ''}                        
                        { archive ? <Button onClick={this.undoItem.bind(this, item)}>Undo</Button> : ''}
                      </ButtonGroup>
                    </td>
                  </tr>
                )
              }
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
  updateItem: React.PropTypes.func.isRequired,
  deleteItem: React.PropTypes.func.isRequired,
  undoItem: React.PropTypes.func.isRequired
}
