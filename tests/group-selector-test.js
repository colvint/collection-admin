jest.unmock('../src/group-selector.js')

import React from 'react'
import ReactDOM from 'react-dom'
import ReactTU from 'react-addons-test-utils'
import createPeople from '../test-fixtures/people.js'
import GroupSelector from '../src/group-selector.js'
import _ from 'underscore'
import sinon from 'sinon'

describe('group selector', () => {
  const items = createPeople(3)
  const allItemIds = _.pluck(items, '_id')

  let component
  let onSelectedSpy = sinon.spy()

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
    expect(onSelectedSpy.calledWith(_.pluck(items, '_id'))).toBeTruthy()
  })

  it('selects none', () => {
    component.selectNone()
    expect(onSelectedSpy.calledWith([])).toBeTruthy()
  })

  it('selects inverse', () => {
    component.selectInverse()
    expect(onSelectedSpy.calledWith(_.last(allItemIds, 1))).toBeTruthy()
  })
})
