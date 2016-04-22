jest.unmock('../src/sorter.js');

import React from 'react';
import ReactDOM from 'react-dom';
import ReactTU from 'react-addons-test-utils';
import createPeople from '../test-fixtures/people.js';
import Sorter from '../src/sorter.js';
import sinon from 'sinon';

describe('sorter', () => {
  let component;
  let onSortSpy = sinon.spy();

  beforeEach(() => {
    component = ReactTU.renderIntoDocument(
      <Sorter field="firstName" onSort={onSortSpy} />
    );
  });

  it('toggles the sort', () => {
    // starts off unsorted
    expect(component.state.direction).toBeNull();

    // toggles to ascending
    component.toggleSort();
    expect(component.state.direction).toEqual(1);
    expect(onSortSpy.calledWith({firstName: 1})).toBeTruthy();

    // then toggles to descending
    component.toggleSort();
    expect(component.state.direction).toEqual(-1);
    expect(onSortSpy.calledWith({firstName: -1})).toBeTruthy();

    // then toggles to back to unsorted
    component.toggleSort();
    expect(component.state.direction).toBeNull;
    expect(onSortSpy.calledWith({firstName: null})).toBeTruthy();
  });
});
