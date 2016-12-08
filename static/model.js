import _ from 'underscore'
import uuidV4 from 'uuid/v4'

const itemSchema = {
  ticker: {
    type: String,
  },
  lastPrice: {
    type: Number,
  },
  dateOfIPO: {
    type: Date,
  }
}

const items = []

const addItem = (itemAttrs) => {
  const _id = uuidV4()
  items.push(_.extend({ _id: _id }, itemAttrs))
}

const updateItem = (oldItem, updatedItem) => {
  var index = items.indexOf(oldItem);
  items.splice(index, 1, updatedItem);
}

const fetchItems = (selector = {}, fetchOptions = {}) => {
  const sortKey = _.first(_.keys(fetchOptions.sort))

  if (sortKey) {
    const sortDir = fetchOptions.sort[sortKey]
    const sortedItems = _.sortBy(items, sortKey)

    return sortDir === 1 ?  sortedItems : sortedItems.reverse()
  } else {
    return items
  }
}

addItem({ ticker: 'GOOG', lastPrice: 312.35 })
addItem({ ticker: 'AAPL', lastPrice: 4.33 })
addItem({ ticker: 'FB', lastPrice: 38.11 })

export { fetchItems as default, addItem, itemSchema, updateItem}
