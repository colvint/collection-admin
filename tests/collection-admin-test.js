jest.unmock('../src/collection-admin.js');

import React from 'react';
import ReactDOM from 'react-dom';
import ReactTU from 'react-addons-test-utils';
import CollectionAdmin from '../src/collection-admin.js';
import Chance from 'chance';
import _ from 'underscore';

const chance = new Chance();

describe('collection admin', () => {
  const items = _.map([1, 2, 3], (i) => {
    return {
      _id: chance.guid(),
      firstName: chance.first(),
      lastName: chance.last(),
      age: chance.age(),
    };
  });

  let component;

  beforeEach(() => {
    component = ReactTU.renderIntoDocument(<CollectionAdmin items={items} />);
    component.setState({selectedItemIds: []});
  });

  it('lists all items', () => {
    const rows = ReactTU.scryRenderedDOMComponentsWithClass(component, 'item');

    expect(rows.length).toEqual(3);
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
    const headers = ReactTU.scryRenderedDOMComponentsWithClass(component, 'header');

    expect(headers.length).toEqual(3);
    expect(headers[0].textContent).toEqual('First name');
    expect(headers[1].textContent).toEqual('Last name');
    expect(headers[2].textContent).toEqual('Age');
  });

  it('selects individual items', () => {
    const itemSelectors = ReactTU.scryRenderedDOMComponentsWithClass(component, 'itemSelector');

    expect(itemSelectors.length).toEqual(3);

    expect(component.state.selectedItemIds).toEqual([]);
    component.onItemSelected(items[0]._id);
    expect(component.state.selectedItemIds).toContain(items[0]._id);
    component.onItemSelected(items[1]._id);
    expect(component.state.selectedItemIds).toContain(items[1]._id);
  });

  it('selects all items', () => {
    expect(component.state.selectedItemIds);
    console.log(component.refs);
    ReactTU.Simulate.click(component.refs.selectAll);
    expect(component.state.selectedItemIds.length).toEqual(3)
  });
});
