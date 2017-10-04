var data16 = require('./2016.json');
var data17 = require('./2017.json');

data16.map(el => (el['year'] = 2016));
data17.map(el => (el['year'] = 2017));

console.log(data16);

const Data = {
  2016: data16,
  2017: data17,
};

export default Data;
