import React from 'react'
import ReactDOM from 'react-dom'
import { FormControl, Modal } from 'react-bootstrap'
import { shallow, mount, render } from 'enzyme'

jest.unmock('../src/item-editor.js')

import ItemEditor from '../src/item-editor.js'

const itemSchema = {
  firstName: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
}

describe("item-editor", () => {
  describe("new item", () => {
    const onHideSpy = jest.fn()
    const addItemSpy = jest.fn()
    const updateItemSpy = jest.fn()

    let wrapper

    beforeEach(() => {
      wrapper = shallow(
        <ItemEditor
          show
          isNew
          item={{}}
          itemType="person"
          itemSchema={itemSchema}
          onHide={onHideSpy}
          addItem={addItemSpy}
          updateItem={updateItemSpy}
        />
      )
    })

    it("renders the title", () => {
      expect(wrapper.find(Modal.Title).first().html())
        .toEqual('<h4 class="modal-title">New Person</h4>')
    })

    it("renders all fields in the item schema", () => {
      expect(wrapper.find(FormControl).length)
        .toEqual(2)
    })

    it("renders fields with the correct input type", () => {
      expect(wrapper.find('[type="text"]').length)
        .toEqual(1)
      expect(wrapper.find('[type="date"]').length)
        .toEqual(1)
    })

    it("calls the addItem handler with the update item state", () => {
      wrapper.find('#saveBtn').simulate('click')
      expect(addItemSpy).toHaveBeenCalled()
    })
  })
})
