export default class Validator {
  constructor(itemSchema) {
    this.itemSchema = itemSchema
  }

  isFieldValid(fieldName, item) {
    return !!item[fieldName]
  }
}
