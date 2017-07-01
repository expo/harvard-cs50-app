import React from 'react';
import { StyleSheet, Text, View, ListView, TouchableHighlight, Dimensions } from 'react-native';
import Expo, { FileSystem as FS } from 'expo';

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
      console.log(n[0].value);
      var newArray = this.state.db.slice();
      newArray.push(n[0].value);
      this.setState({
          dataSource: this.state.dataSource.cloneWithRows(newArray),
          db: newArray,
      });
      curr++;
    }
  }

  onWeekPress(rowData) {

  }

  renderRowView(rowData) {
      return (
        <TouchableHighlight
          style={styles.weekButton}
          onPress={this.onWeekPress(rowData)}
          >
          <Text style={styles.weekText}>
            {rowData}
          </Text>
        </TouchableHighlight>
      );
  }

  render() {
    return (
      <View style={styles.container}>
      <Text></Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRowView.bind(this)}
        />
      </View>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekText: {
    fontSize: 45,
    fontFamily: 'AppleSDGothicNeo-Light',
  },
});
