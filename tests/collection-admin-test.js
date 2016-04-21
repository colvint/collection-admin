jest.unmock('../src/collection-admin.jsx');

import React from 'react';
import ReactDOM from 'react-dom';
import ReactTU from 'react-addons-test-utils';
import CollectionAdmin from '../src/collection-admin.jsx';

describe('collection admin', function () {
  let component;
  let items = [
    {firstName: 'John', lastName: 'Cena', age: 25},
    {firstName: 'Jerry', lastName: 'McGuire', age: 50},
    {firstName: 'Jake', lastName: 'LaSnake', age: 95},
  ];

  beforeEach(function () {
    component = ReactTU.renderIntoDocument(
      <CollectionAdmin
        items={items}
      />
    );
  });

  it('lists all items', function () {
    const rows = ReactTU.scryRenderedDOMComponentsWithClass(component, 'item');

    expect(rows.length).toEqual(3);
  });

  it('displays the item data', function () {
    const firstNames = ReactTU.scryRenderedDOMComponentsWithClass(component, 'firstName');
    const lastNames = ReactTU.scryRenderedDOMComponentsWithClass(component, 'lastName');
    const ages = ReactTU.scryRenderedDOMComponentsWithClass(component, 'age');

    expect(firstNames[0].textContent).toEqual('John');
    expect(lastNames[0].textContent).toEqual('Cena');
    expect(ages[0].textContent).toEqual('25');
  });


  it('displays the column headers', function () {
    const headers = ReactTU.scryRenderedDOMComponentsWithTag(component, 'th');

    expect(headers.length).toEqual(3);
    expect(headers[0].textContent).toEqual('First name');
    expect(headers[1].textContent).toEqual('Last name');
    expect(headers[2].textContent).toEqual('Age');
  });
});
