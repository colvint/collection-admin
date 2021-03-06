jest.unmock('../../src/conditions/meteor.js')

import Condition from '../../src/conditions/meteor'

describe('meteor condition', () => {
  it('returns the is empty query', () => {
    const condition = new Condition('foo')

    expect(condition['isEmpty']()).toEqual({foo: {$exists: false}})
  })

  it('returns the is not empty query', () => {
    const condition = new Condition('foo')

    expect(condition['isNotEmpty']()).toEqual({foo: {$exists: true}})
  })

  it('returns the text contains query', () => {
    const condition = new Condition('foo', 'bar')

    expect(condition['textContains']()).toEqual({foo: {$regex: 'bar'}})
  })
})
