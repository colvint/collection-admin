import Chance from 'chance';
import _ from 'underscore';

const chance = new Chance();

const createPeople = (count) => {
  return _.range(count).map((i) => {
    return {
      _id: chance.guid(),
      isArchive: false,
      firstName: chance.first(),
      lastName: chance.last(),
      age: chance.age(),
    }
  });
}

export default createPeople;
