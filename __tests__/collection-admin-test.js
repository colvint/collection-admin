jest.unmock('../src/collection-admin')
jest.unmock('../src/conditions/meteor')

import React from 'react'
import ReactDOM from 'react-dom'
import { shallow } from 'enzyme'
import _ from 'underscore'
import createPeople from '../test-fixtures/people'
import CollectionAdmin from '../src/collection-admin'

const itemSchema = {
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  age: {
    type: Number,
  },
  dateOfBirth: {
    type: Date
  },
  isEmployed: {
    type: Boolean
  }
}

describe('collection admin', () => {
  const items = createPeople(3)
  const allItemIds = _.pluck(items, '_id')
  const addItemSpy = jest.fn()
  const updateItemSpy = jest.fn()

  let wrapper, component
  let fetchItems = jest.fn(() => items)

  beforeEach(() => {
    wrapper = shallow(
      <CollectionAdmin
        itemType="person"
        fetchItems={fetchItems}
        itemSchema={itemSchema}
        addItem={addItemSpy}
        updateItem={updateItemSpy}
      />
    )
    wrapper.setState({selectedItemIds: [], archiveItem: false})
    component = wrapper.instance()
  })

  it('lists all items', () => {
    expect(component.allItems().length).toEqual(3)
  })

  it('reads columns from the item schema', () => {
    expect(component.columns()).toEqual(['firstName', 'lastName', 'age', 'dateOfBirth', 'isEmployed'])
  })

  it('displays the item data', () => {
    const firstNames = wrapper.find('.firstName')
    const lastNames = wrapper.find('.lastName')
    const ages = wrapper.find('.age')

    expect(firstNames.at(0).text()).toEqual(items[0].firstName)
    expect(lastNames.at(0).text()).toEqual(items[0].lastName)
    expect(ages.at(0).text()).toEqual(`${items[0].age}`)
  })

  it('displays the column sorter and filters', () => {
    const sorters = wrapper.find('Sorter')
    const filters = wrapper.find('Filter')

    expect(sorters).toHaveLength(5)
    expect(filters).toHaveLength(5)
  })

  it('selects individual items', () => {
    const itemSelectors = wrapper.find('Checkbox')

    expect(itemSelectors).toHaveLength(3)
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
