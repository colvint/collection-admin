import Chance from 'chance';
import _ from 'underscore';

const chance = new Chance();

const createPeople = function (count) {
  return _.range(count).map((i) => {
    return {
      _id: chance.guid(),
      firstName: chance.first(),
      lastName: chance.last(),
      age: chance.age(),
    }
  });
}

export default createPeople;
