const XMLParser = require('react-xml-parser');

const getWeekNumber = title => {
  var num = title.charAt(title.length - 1);
  if (title.charAt(title.length - 2) === '1') {
    num = '1' + num;
  }
  return num;
};

const getPSetURL = url => {
  var length = url.length;
  var week = url.charAt(length - 6);
  if (!isNaN(url.charAt(length - 7))) {
    week = week + 10;
  }
  var season;
  if (url.charAt(26) == 'f') {
    season = 'fall';
  } else if (url.charAt(26) == 's') {
    season = 'spring';
  } else {
    season = 'winter';
  }
  return (
    'http://docs.cs50.net/2016/' +
    season +
    '/psets/' +
    week +
    '/pset' +
    week +
    '.html'
  );
};

const parseWeek = data => {
  var json = {};
  for (var i = 0; i < data.length - 1; i++) {
    if (i < 2) {
      json[data[i].name.toLowerCase()] = data[i].value;
    } else {
      var title = data[i].children[0].value;
      var link = data[i].children[1].attributes.href;
      json[title.toLowerCase()] = link;
    }
  }
  var videos = {};
  var videoData = data[data.length - 1].children[1].children;
  for (var i = 1; i < videoData.length; i++) {
    var link = videoData[i].attributes.href;
    var type = videoData[i].children[0].value;
    videos[type.toLowerCase()] = link;
  }
  json['weekNumber'] = parseInt(getWeekNumber(json.title));
  json[data[data.length - 1].children[0].value.toLowerCase()] = videos;
  return json;
};

async function loadData() {
  const asset = Expo.Asset.fromModule(require('../xml/lectures.xml'));
  const text = await (await fetch(asset.uri)).text();
  var xml = new XMLParser().parseFromString(text);
  var curr = 0;
  var c = xml.children;

  var data = [];

  var titlesToExclude = ['Week 0 at Yale', 'Week 11 at Yale'];

  while (c[curr]) {
    var n = c[curr].children;
    var weekObj = parseWeek(n);
    if (!titlesToExclude.includes(weekObj.title)) {
      data.push(weekObj);
    }
    curr++;
  }

  return data;
}

export default loadData;
