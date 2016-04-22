jest.unmock('../src/collection-admin.js');

import React from 'react';
import ReactDOM from 'react-dom';
import ReactTU from 'react-addons-test-utils';
import _ from 'underscore';
import sinon from 'sinon';

import createPeople from '../test-fixtures/people.js';

import CollectionAdmin from '../src/collection-admin.js';

describe('collection admin', () => {
  const items = createPeople(3);
  const allItemIds = _.pluck(items, '_id');

  let component;
  let fetchItems = sinon.stub();

  fetchItems.returns(items);

  beforeEach(() => {
    component = ReactTU.renderIntoDocument(<CollectionAdmin fetchItems={fetchItems} />);
    component.setState({selectedItemIds: []});
  });

  it('lists all items', () => {
    expect(component.allItems().length).toEqual(3);
  });

  it('knows the fields', () => {
    expect(component.fields()).toEqual(['_id', 'firstName', 'lastName', 'age']);
  });

  it('does not include _id in the headers', () => {
    expect(component.headers()).toEqual(['firstName', 'lastName', 'age']);
  });

  it('displays the item data', () => {
    const firstNames = ReactTU.scryRenderedDOMComponentsWithClass(component, 'firstName');
    const lastNames = ReactTU.scryRenderedDOMComponentsWithClass(component, 'lastName');
    const ages = ReactTU.scryRenderedDOMComponentsWithClass(component, 'age');

    expect(firstNames[0].textContent).toEqual(items[0].firstName);
    expect(lastNames[0].textContent).toEqual(items[0].lastName);
    expect(ages[0].textContent).toEqual(`${items[0].age}`);
  });

  it('displays the column headers', () => {
    expect(component.refs.firstNameHeader.props.children).toEqual('First name');
    expect(component.refs.lastNameHeader.props.children).toEqual('Last name');
    expect(component.refs.ageHeader.props.children).toEqual('Age');
  });

  it('selects individual items', () => {
    const itemSelectors = ReactTU.scryRenderedDOMComponentsWithClass(component, 'itemSelector');

    expect(itemSelectors.length).toEqual(3);
    expect(component.state.selectedItemIds).toEqual([]);
    component.onItemSelected(allItemIds[0]);
    expect(component.state.selectedItemIds).toContain(allItemIds[0]);
    component.onItemSelected(allItemIds[1]);
    expect(component.state.selectedItemIds).toContain(allItemIds[1]);
  });

  it('knows whether an item is selected', function () {
    expect(component.isItemSelected(allItemIds[0])).toBeFalsy();
    component.updateSelectedItems(_.first(allItemIds, 1));
    expect(component.isItemSelected(allItemIds[0])).toBeTruthy();
  });

  it('filters items', () => {
    const itemFilter = {firstName: items[0].firstName};

    expect(component.state.itemFilter).toEqual({});
    component.setState({itemFilter: itemFilter});
    expect(fetchItems.calledWith(itemFilter)).toBeTruthy();
  });

  it('sorts items', () => {
    expect(component.state.fetchOptions).toEqual({sort: {}});
    component.onSort({firstName: 1});
    expect(component.state.fetchOptions).toEqual({sort: {firstName: 1}});
    component.onSort({firstName: -1});
    expect(component.state.fetchOptions).toEqual({sort: {firstName: -1}});
    component.onSort({lastName: 1});
    expect(component.state.fetchOptions).toEqual({sort: {firstName: -1, lastName: 1}});
    component.onSort({lastName: null});
    expect(component.state.fetchOptions).toEqual({sort: {firstName: -1}});
  });
});
