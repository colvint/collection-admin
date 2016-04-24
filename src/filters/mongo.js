const FilterTypes = [
  "cellIsEmpty",
  "cellIsNotEmpty",
]

class MongoFilter {
  constructor(filterType, field) {
    this.field = field
    this.filterType = filterType
  }

  getQuery() {
    return this[this.filterType]()
  }

  cellIsEmpty() {
    return {[this.field]: {$exists: false}}
  }

  cellIsNotEmpty() {
    return {[this.field]: {$exists: true}}
  }
}

export { MongoFilter as default, FilterTypes }
