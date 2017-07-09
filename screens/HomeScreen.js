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

var bgImage = require('../assets/harvard.jpg');

class HomeScreen extends React.Component {
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
  }

  async readXml() {
    const asset = Expo.Asset.fromModule(require('../xml/lectures.xml'));
    const text = await (await fetch(asset.uri)).text();
    var xml = new XMLParser().parseFromString(text);
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

    // Note (Abi): Uncomment to debug the video screen
    //this.onWeekPress(this.state.dataSource.getRowData(0, 0));
  }

  onWeekPress = weekData => {
    this.props.navigation.navigate('Week', { data: weekData });
  };

  renderRowView(rowData) {
    return (
      <View style={{ paddingTop: 10, paddingBottom: 0 }}>
        <Card
          styles={{
            height: Dimensions.get('window').height / 7,
            width: Dimensions.get('window').width - 40,
            alignItems: 'flex-start',
          }}>
          <CardImage>
            <TouchableHighlight
              onPress={() => {
                this.onWeekPress(rowData);
              }}>
              <Image
                style={{
                  height: Dimensions.get('window').height / 8,
                  width: Dimensions.get('window').width - 10,
                  justifyContent: 'center',
                  paddingLeft: 30,
                }}
                source={bgImage}>
                <Text
                  style={{
                    fontFamily: 'roboto-light',
                    fontSize: 25,
                    color: 'white',
                    fontWeight: 'bold',
                    backgroundColor: 'transparent',
                    alignSelf: 'flex-start',
                  }}>
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
          <View
            style={{
              paddingLeft: 20,
              paddingRight: 20,
            }}>
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

export default HomeScreen;
