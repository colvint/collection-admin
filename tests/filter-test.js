jest.unmock('../src/filter.js')

import React from 'react'
import ReactDOM from 'react-dom'
import ReactTU from 'react-addons-test-utils'
import Filter from '../src/filter.js'
import sinon from 'sinon'

describe('filter', () => {
  let component
  const onFilterSpy = sinon.spy()

  beforeEach(() => {
    component = ReactTU.renderIntoDocument(
      <Filter field="firstName" onFilter={onFilterSpy} />
    )
  })

  it('filters', () => {
    expect(component.state.enabledFilter).toBeNull()

    component.toggleFilter("cellIsFoobar")
    expect(component.state.enabledFilter).toEqual("cellIsFoobar")
    expect(onFilterSpy.calledWith({firstName: {cellIsFoobar: true}})).toBeTruthy()

    component.toggleFilter("cellIsFoobar")
    expect(component.state.enabledFilter).toBeNull()
    expect(onFilterSpy.calledWith({firstName: {cellIsFoobar: false}})).toBeTruthy()
  })
})
