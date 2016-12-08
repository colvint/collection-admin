jest.unmock('../../src/validators/simple-schema.js')

import Validator from '../../src/validators/simple-schema'

const itemSchema = {
  firstName: {
    type: String,
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

  it("validates an individual field against the schema", () => {
    expect(validator.isFieldValid('firstName', item, itemSchema)).toBeFalsy()
    item.firstName = 'Willy'
    expect(validator.isFieldValid('firstName', item, itemSchema)).toBeTruthy()
  })
})
