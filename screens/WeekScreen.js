import React from 'react';
import {
  Text,
  Image,
  View,
  ListView,
  TouchableHighlight,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo';
import { Card, CardImage } from 'react-native-card-view';
const XMLParser = require('react-xml-parser');

var classes = [];

class WeekScreen extends React.Component {
  static navigationOptions = {
    title: 'CS50 Week by Week',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#821c21',
      paddingTop: 20,
      height: Platform.OS === 'ios' ? 80 : 100,
    },
  };

  constructor() {
    super();
    this.readXml();
    var ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      dataSource: ds.cloneWithRows(classes),
      db: classes,
    };
  }

  _createJSON(data) {
    var json = {};
    for (var i = 0; i < data.length - 1; i++) {
      if (i < 2) {
        json[data[i].name] = data[i].value;
        json[data[i].name] = data[i].value;
      } else {
        var title = data[i].children[0].value;
        var link = data[i].children[1].attributes.href;
        json[title] = link;
      }
    }
    var videos = {};
    var videoData = data[data.length - 1].children[1].children;
    for (var i = 1; i < videoData.length; i++) {
      var link = videoData[i].attributes.href;
      var type = videoData[i].children[0].value;
      videos[type] = link;
    }
    json[data[data.length - 1].children[0].value] = videos;
    return json;
  }

  async readXml() {
    const asset = Expo.Asset.fromModule(require('../xml/lectures.xml'));
    const text = await (await fetch(asset.uri)).text();
    // console.log('contents: ', text);
    var xml = new XMLParser().parseFromString(text);
    // var file = await FS.readAsStringAsync('./xml/lectures.txt', {});
    // console.log(xml);
    var curr = 0;
    var c = xml.children;
    while (c[curr]) {
      var n = c[curr].children;
      var json = this._createJSON(n);
      var newArray = this.state.db.slice();
      newArray.push(json);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(newArray),
        db: newArray,
      });
      curr++;
    }
  }

  onWeekPress = weekData => {
    this.props.navigation.navigate('Lecture', { data: weekData });
  };

  renderRowView(rowData) {
    return (
      <View style={{ paddingTop: 10, paddingBottom: 0 }}>
        <Card
          styles={{
            card: { width: styles.weekImage.width },
          }}>
          <CardImage>
            <TouchableHighlight
              onPress={() => {
                this.onWeekPress(rowData);
              }}>
              <Image
                style={styles.weekImage}
                source={require('../assets/harvard.jpg')}>
                <Text style={styles.weekText}>
                  {rowData.title}
                </Text>
              </Image>
            </TouchableHighlight>
          </CardImage>
        </Card>
      </View>
    );
  }

  render() {
    return (
      <View>
        <LinearGradient colors={['#a73737', '#7a2828']}>
          <View style={styles.listViewView}>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderRowView.bind(this)}
              enableEmptySections={true}
            />
          </View>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listViewView: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  weekButton: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: Dimensions.get('window').height / 6,
    width: Dimensions.get('window').width,
    paddingVertical: 15,
    paddingLeft: 20,
    backgroundColor: '#fff',
  },
  card: {
    height: Dimensions.get('window').height / 7,
    width: Dimensions.get('window').width - 40,
    alignItems: 'flex-start',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
  },
  weekText: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
  },
  weekTextArrow: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    textAlign: 'right',
  },
  weekContentText: {
    color: 'gray',
    textAlign: 'left',
  },
  weekImage: {
    height: Dimensions.get('window').height / 8,
    width: Dimensions.get('window').width - 10,
    justifyContent: 'center',
    paddingLeft: 30,
  },
  weekButton: {
    height: Dimensions.get('window').height / 16,
    width: Dimensions.get('window').width - 40,
    justifyContent: 'center',
    paddingLeft: 30,
  },
  weekContent: {
    height: Dimensions.get('window').height / 20,
    width: Dimensions.get('window').width - 40,
    justifyContent: 'center',
    paddingLeft: 30,
    backgroundColor: 'red',
  },
});

export default WeekScreen;
