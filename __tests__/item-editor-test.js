jest.unmock('../src/item-editor.js')

import React from 'react'
import ReactDOM from 'react-dom'
import { Checkbox, FormControl, Modal } from 'react-bootstrap'
import { shallow } from 'enzyme'
import ItemEditor from '../src/item-editor'
import Validator from "../src/validators/simple-schema"
import moment from "moment"

const itemSchema = {
  firstName: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  age: {
    type: Number,
    optional: true
  },
  isEmployed: {
    type: Boolean,
    optional: true
  }
}

const validator = new Validator(itemSchema)

describe("item-editor", () => {
  describe("new item", () => {
    const onHideSpy = jest.fn()
    const addItemSpy = jest.fn()
    const updateItemSpy = jest.fn()

    let wrapper
    let component

    beforeEach(() => {
      wrapper = shallow(
        <ItemEditor
          show
          isNew
          itemType="person"
          itemSchema={itemSchema}
          onHide={onHideSpy}
          addItem={addItemSpy}
          updateItem={updateItemSpy}
          validator={validator}
        />
      )
      component = wrapper.instance()
    })

    it("renders the title", () => {
      expect(wrapper.find(Modal.Title).first().html()).toEqual('<h4 class="modal-title">New Person</h4>')
    })

    it("renders all fields in the item schema", () => {
      expect(wrapper.find(FormControl).length).toEqual(3)
      expect(wrapper.find(Checkbox).length).toEqual(1)
    })

    it("calls the addItem handler with the update item state", () => {
      wrapper.find('#saveBtn').simulate('click')
      expect(addItemSpy).toHaveBeenCalled()
    })

    it("casts date field input", () => {
      const dateOfBirthInput = wrapper.find('[type="date"]')

      expect(component.state.item.dateOfBirth).toBeUndefined()
      dateOfBirthInput.simulate('change', {target: {value: '2016-12-16'}})
      expect(component.state.item.dateOfBirth).toEqual(moment('2016-12-16', 'YYYY-MM-DD').toDate())
    })

    it("casts checkbox field input", () => {
      const isEmployedInput = wrapper.find(Checkbox)

      expect(component.state.item.isEmployed).toBeUndefined()
      isEmployedInput.simulate('change', {target: {checked: true}})
      expect(component.state.item.isEmployed).toBe(true)
    })

    it("casts number field input", () => {
      const ageInput = wrapper.find(FormControl).at(2)

      expect(component.state.item.age).toBeUndefined()
      ageInput.simulate('change', {target: {value: "10"}})
      expect(component.state.item.age).toEqual(10)
    })

    it("sets validation state and message on fields", () => {
      expect(wrapper.find('FormGroup').at(0).props().validationState).toEqual('error')
      expect(wrapper.find('HelpBlock').at(0).render().text()).toEqual("First name is required")
      component.setState({item: {firstName: 'Timmy', dateOfBirth: new Date()}})
      expect(wrapper.find('FormGroup').at(0).props().validationState).toEqual('success')
      expect(wrapper.find('HelpBlock')).toHaveLength(0)
    })
  })
})
