import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  Dimensions,
  Image,
  StatusBar,
  Button
} from 'react-native';
import Expo, {
  LinearGradient,
 } from 'expo';
import {
  Card,
  CardImage,
  CardTitle,
  CardContent,
  CardAction
} from 'react-native-card-view';

const XMLParser = require('react-xml-parser');
var classes = [];

export default class App extends React.Component {

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

  async readXml() {
    const asset = Expo.Asset.fromModule(require('./xml/lectures.xml'));
    const text = await (await fetch(asset.uri)).text();
    // console.log('contents: ', text);
    var xml = new XMLParser().parseFromString(text);
    // var file = await FS.readAsStringAsync('./xml/lectures.txt', {});
    //console.log(xml);
    var curr = 0;
    var c = xml.children;
    while (c[curr].children) {
      var n = c[curr].children;
      var newArray = this.state.db.slice();
      newArray.push(n[0].value);
      this.setState({
          dataSource: this.state.dataSource.cloneWithRows(newArray),
          db: newArray,
      });
      curr++;
    }
  }

  onWeekPress() {
    console.log('cool');
  }

  /*renderRowView(rowData) {
      return (
        <Card>
          <CardImage>
            <TouchableHighlight onPress={this.onWeekPress(rowData)}>
              <Image style={styles.weekImage} source={{uri: 'http://i.imgur.com/J2gBY7D.jpg'}}>
                <Text style={styles.weekText}>{rowData}</Text>
              </Image>
            </TouchableHighlight>
          </CardImage>
        </Card>
      );
  }*/

  renderRowView(rowData) {
      return (
        <Card>
          <CardImage>
            <TouchableHighlight onPress={this.onWeekPress.bind(this)}>
              <Image style={styles.weekImage} source={{uri: 'http://i.imgur.com/J2gBY7D.jpg'}}>
                <Text style={styles.weekText}>{rowData}</Text>
              </Image>
            </TouchableHighlight>
          </CardImage>
        </Card>
      );
  }

  render() {
    return (
      <View style={styles.container}>
      </View>
    )
  }
  render() {
    return (
      <LinearGradient
        colors={['#a73737', '#7a2828']}
        style={styles.container}
      >
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRowView.bind(this)}
        />
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  weekButton: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: (Dimensions.get('window').height / 6),
    width: Dimensions.get('window').width,
    paddingVertical: 15,
    paddingLeft: 20,
    backgroundColor: '#fff',
  },
  card: {
    height: (Dimensions.get('window').height / 7),
    width: Dimensions.get('window').width - 40,
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
    height: (Dimensions.get('window').height / 8),
    width: Dimensions.get('window').width - 40,
    justifyContent: 'center',
    paddingLeft: 30,
  },
  weekButton: {
    height: (Dimensions.get('window').height / 16),
    width: Dimensions.get('window').width - 40,
    justifyContent: 'center',
    paddingLeft: 30,
  },
  weekContent: {
    height: (Dimensions.get('window').height / 20),
    width: Dimensions.get('window').width - 40,
    justifyContent: 'center',
    paddingLeft: 30,
    backgroundColor: 'red',
  }
});
