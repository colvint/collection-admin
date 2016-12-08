jest.unmock('../src/sorter.js')

import React from 'react'
import ReactDOM from 'react-dom'
import ReactTU from 'react-addons-test-utils'
import Sorter from '../src/sorter.js'

describe('sorter', () => {
  let component
  const onSortSpy = jest.fn()

  beforeEach(() => {
    component = ReactTU.renderIntoDocument(
      <Sorter field="firstName" onSort={onSortSpy} />
    )
  })

  it('toggles the sort', () => {
    // starts off unsorted
    expect(component.state.direction).toBeNull()

    // toggles to ascending
    component.toggleSort()
    expect(component.state.direction).toEqual(1)
    expect(onSortSpy).toHaveBeenCalledWith({firstName: 1})

    // then toggles to descending
    component.toggleSort()
    expect(component.state.direction).toEqual(-1)
    expect(onSortSpy).toHaveBeenCalledWith({firstName: -1})

    // then toggles to back to unsorted
    component.toggleSort()
    expect(component.state.direction).toBeNull
    expect(onSortSpy).toHaveBeenCalledWith({firstName: null})
  })
})
