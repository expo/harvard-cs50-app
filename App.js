import React from 'react';
import { StyleSheet, Text, View, ListView } from 'react-native';
import Expo, { FileSystem as FS } from 'expo';

const XMLParser = require('react-xml-parser');
var classes = [''];

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
    for (var i = 0; i < 13; i++) {
      var c = xml.children;
      var n = c[i].children;
      console.log(n[0].value);
      var newArray = this.state.db.slice();
      newArray.push(n[0].value);
      this.setState({
          dataSource: this.state.dataSource.cloneWithRows(newArray),
          db: newArray,
      });
    }
  }

  render() {
    return (
      <View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <Text>{rowData}</Text>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
