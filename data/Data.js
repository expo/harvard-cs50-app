var _ = require('lodash');
var data16 = require('./2016.json');
var data17 = require('./2017.json');

let checkDuplicateIds = data => {
  let ids = _.map(data, 'weekNumber');
  if (_.uniq(ids).length != ids.length) {
    throw new Error('You have duplicate IDs in your data, which isnt allowed');
  }
};

checkDuplicateIds(data16);
checkDuplicateIds(data17);

data16.map(el => {
  el.year = 2016;
  el.id = el.year + '_' + el.weekNumber;
});

data17.map(el => {
  el.year = 2017;
  el.id = el.year + '_' + el.weekNumber;
});

const Data = {
  2016: data16,
  2017: data17,
};

export default Data;
