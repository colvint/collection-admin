import _ from 'underscore';

const items = [
  {_id: '1', ticker: 'GOOG', lastPrice: 312.35},
  {_id: '2', ticker: 'AAPL', lastPrice: 4.33},
  {_id: '3', ticker: 'FB', lastPrice: 38.11},
]

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

export default fetchItems;
