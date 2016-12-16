jest.unmock('../../src/validators/simple-schema.js')

import Validator from '../../src/validators/simple-schema'

const itemSchema = {
  firstName: {
    type: String,
    min: 2,
  },
  dateOfBirth: {
    type: Date,
  },
}

let item = {}
let validator

describe('simple schema validator', () => {
  beforeEach(() => {
    validator = new Validator(itemSchema)
  });

  it("validates an individual field", () => {
    expect(validator.fieldError('firstName', item)).toBe('First name is required')
    item.firstName = 'Willy'
    expect(validator.fieldError('firstName', item)).toBeFalsy()
  })

  it("validates an entire item", () => {
    item.firstName = 'Willy'
    expect(validator.isItemValid(item)).toBeFalsy()
    item.dateOfBirth = new Date()
    expect(validator.isItemValid(item)).toBeTruthy()
  })
})
