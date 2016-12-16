import SimpleSchema from 'simpl-schema'

export default class Validator {
  constructor(itemSchema) {
    this.itemSchema = itemSchema
    this.validationContext = new SimpleSchema(itemSchema).newContext()
  }

  fieldError(fieldKey, item) {
    this.validationContext.validate(item, { keys: [fieldKey] })
    return this.validationContext.keyErrorMessage(fieldKey)
  }

  isItemValid(item) {
    this.validationContext.validate(item)
    return this.validationContext.isValid()
  }
}
