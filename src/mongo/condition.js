const ConditionTypes = {
  isEmpty: {valueType: null},
  isNotEmpty: {valueType: null},
  textContains: {valueType: String},
}

class MongoCondition {
  constructor(field, conditionValue) {
    this.field = field
    this.conditionValue = conditionValue
  }

  isEmpty() {
    return {[this.field]: {$exists: false}}
  }

  isNotEmpty() {
    return {[this.field]: {$exists: true}}
  }

  textContains() {
    const text = this.conditionValue || "";

    return {[this.field]: {$regex: text}}
  }
}

export { ConditionTypes, MongoCondition as default }
