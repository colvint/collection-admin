jest.unmock('../src/collection-admin.js');
jest.unmock('../test-fixtures/people.js');

import React from 'react';
import ReactDOM from 'react-dom';
import ReactTU from 'react-addons-test-utils';
import createPeople from '../test-fixtures/people.js';
import CollectionAdmin from '../src/collection-admin.js';
import Chance from 'chance';
import _ from 'underscore';

const chance = new Chance();

describe('collection admin', () => {
  const items = createPeople(3);
  const allItemIds = _.pluck(items, '_id');

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
});
