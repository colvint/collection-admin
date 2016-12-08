jest.unmock('../src/group-selector.js')

import React from 'react'
import ReactDOM from 'react-dom'
import ReactTU from 'react-addons-test-utils'
import createPeople from '../test-fixtures/people.js'
import GroupSelector from '../src/group-selector.js'
import _ from 'underscore'

describe('group selector', () => {
  const items = createPeople(3)
  const allItemIds = _.pluck(items, '_id')

  let component
  let onSelectedSpy = jest.fn()

  beforeEach(() => {
    component = ReactTU.renderIntoDocument(
      <GroupSelector
        allItemIds={allItemIds}
        selectedItemIds={_.first(allItemIds, 2)}
        onSelected={onSelectedSpy}
      />
    )
  })

  it('selects all items', () => {
    component.selectAll()
    expect(onSelectedSpy).toHaveBeenCalledWith(_.pluck(items, '_id'))

  })

  it('selects none', () => {
    component.selectNone()
    expect(onSelectedSpy).toHaveBeenCalledWith([])
  })

  it('selects inverse', () => {
    component.selectInverse()
    expect(onSelectedSpy).toHaveBeenCalledWith(_.last(allItemIds, 1))
  })
})
