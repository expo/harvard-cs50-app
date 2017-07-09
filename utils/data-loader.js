const XMLParser = require('react-xml-parser');

var parseWeek = function(data) {
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

  while (c[curr]) {
    var n = c[curr].children;
    var json = parseWeek(n);
    data.push(json);
    curr++;
  }

  return data;
}

export default loadData;
