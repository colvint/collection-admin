jest.unmock('../../src/filters/mongo.js')

import MongoFilter from '../../src/filters/mongo.js'

describe('mongo filter', () => {
  it('returns the cell is empty query', () => {
    const mongoFilter = new MongoFilter('cellIsEmpty', 'foo')

    expect(mongoFilter.getQuery()).toEqual({foo: {$exists: false}})
  })

  it('returns the cell is not empty query', () => {
    const mongoFilter = new MongoFilter('cellIsNotEmpty', 'foo')

    expect(mongoFilter.getQuery()).toEqual({foo: {$exists: true}})
  })
})
