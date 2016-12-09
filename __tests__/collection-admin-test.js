jest.unmock('../src/collection-admin')
jest.unmock('../src/conditions/meteor')

import React from 'react'
import ReactDOM from 'react-dom'
import ReactTU from 'react-addons-test-utils'
import _ from 'underscore'

import createPeople from '../test-fixtures/people'

import CollectionAdmin from '../src/collection-admin'

describe('collection admin', () => {
  const items = createPeople(3)
  const allItemIds = _.pluck(items, '_id')
  const itemSchema = {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    age: {
      type: String,
    }
  }
  const addItemSpy = jest.fn()
  const updateItemSpy = jest.fn()

  let component
  let fetchItems = jest.fn(() => items)

  beforeEach(() => {
    component = ReactTU.renderIntoDocument(
      <CollectionAdmin
        itemType="stock"
        fetchItems={fetchItems}
        itemSchema={itemSchema}
        addItem={addItemSpy}
        updateItem={updateItemSpy}
      />
    )
    component.setState({selectedItemIds: []})
  })

  it('lists all items', () => {
    expect(component.allItems().length).toEqual(3)
  })

  it('reads columns from the item schema', () => {
    expect(component.columns()).toEqual(['firstName', 'lastName', 'age'])
  })

  it('displays the item data', () => {
    const firstNames = ReactTU.scryRenderedDOMComponentsWithClass(component, 'firstName')
    const lastNames = ReactTU.scryRenderedDOMComponentsWithClass(component, 'lastName')
    const ages = ReactTU.scryRenderedDOMComponentsWithClass(component, 'age')

    expect(firstNames[0].textContent).toEqual(items[0].firstName)
    expect(lastNames[0].textContent).toEqual(items[0].lastName)
    expect(ages[0].textContent).toEqual(`${items[0].age}`)
  })

  it('displays the column headers', () => {
    expect(component.refs.firstNameSorter.props.children).toEqual('First name')
    expect(component.refs.lastNameSorter.props.children).toEqual('Last name')
    expect(component.refs.ageSorter.props.children).toEqual('Age')
  })

  it('selects individual items', () => {
    const itemSelectors = ReactTU.scryRenderedDOMComponentsWithClass(component, 'itemSelector')

    expect(itemSelectors.length).toEqual(3)
    expect(component.state.selectedItemIds).toEqual([])
    component.onItemSelected(allItemIds[0])
    expect(component.state.selectedItemIds).toContain(allItemIds[0])
    component.onItemSelected(allItemIds[1])
    expect(component.state.selectedItemIds).toContain(allItemIds[1])
  })

  it('knows whether an item is selected', function () {
    expect(component.isItemSelected(allItemIds[0])).toBeFalsy()
    component.updateSelectedItems(_.first(allItemIds, 1))
    expect(component.isItemSelected(allItemIds[0])).toBeTruthy()
  })

  it('filters items', () => {
    // expect there to be one filter per field
    expect(component.refs.firstNameFilter).not.toBeUndefined()
    expect(component.refs.lastNameFilter).not.toBeUndefined()
    expect(component.refs.ageFilter).not.toBeUndefined()

    expect(component.state.itemFilter).toEqual({})
    component.onFilter({firstName: {isEmpty: true}})
    expect(component.state.itemFilter).toEqual({firstName: {$exists: false}})
  })

  it('sorts items', () => {
    expect(component.state.fetchOptions).toEqual({sort: {}})
    component.onSort({firstName: 1})
    expect(component.state.fetchOptions).toEqual({sort: {firstName: 1}})
    component.onSort({firstName: -1})
    expect(component.state.fetchOptions).toEqual({sort: {firstName: -1}})
    component.onSort({lastName: 1})
    expect(component.state.fetchOptions).toEqual({sort: {firstName: -1, lastName: 1}})
    component.onSort({lastName: null})
    expect(component.state.fetchOptions).toEqual({sort: {firstName: -1}})
  })

  it('opens the new item modal', () => {
    expect(component.state.itemEditorIsOpen).toBeFalsy()
    component.newItem()
    expect(component.state.itemEditorIsOpen).toBeTruthy()
  })
})
