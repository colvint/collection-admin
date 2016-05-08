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

  it('toggles filters', () => {
    expect(component.state.conditionType).toBeNull()

    component.conditionToggled("isEmpty")
    expect(component.state.conditionType).toEqual("isEmpty")
    expect(onFilterSpy.calledWith({firstName: {isEmpty: true}})).toBeTruthy()

    component.conditionToggled("isEmpty")
    expect(component.state.conditionType).toBeNull()
    expect(onFilterSpy.calledWith({firstName: {isEmpty: false}})).toBeTruthy()
  })

  it('updates condition values', () => {
    expect(component.state.conditionType).toBeNull()

    component.conditionToggled("textContains")
    component.conditionValueChanged({target: {value: "Autism"}})
    expect(component.state.conditionValue).toEqual("Autism")
    expect(onFilterSpy.calledWith({firstName: {textContains: true, value: "Autism"}})).toBeTruthy()
  })
})
