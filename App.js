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
  Button,
  Platform
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
import { StackNavigator } from 'react-navigation';

import NavigationBar from 'react-native-navbar';
const XMLParser = require('react-xml-parser');
var classes = [];

/*const rightButtonConfig = {
  title: 'Next',
  handler: () => alert('hello!'),
};*/

const titleConfig = {
  title: 'CS50 Week by Week',
  tintColor: 'white'
};

class WeekScreen extends React.Component {
  static navigationOptions = {
    title: 'CS50 Week by Week',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor:'#821c21',
      paddingTop: 20,
      height: (Platform.OS === 'ios') ? 80 : 100,
    }
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

  onWeekPress = () => {
    this.props.navigation.navigate('Lecture');
  }

  renderRowView(rowData) {
      return (
        <View style={{ paddingTop: 10, paddingBottom: 0 }}>
          <Card styles={{
            card: {width: styles.weekImage.width},
          }}>
            <CardImage>
              <TouchableHighlight onPress={this.onWeekPress}>
                <Image style={styles.weekImage} source={{uri: 'http://i.imgur.com/J2gBY7D.jpg'}}>
                  <Text style={styles.weekText}>{rowData}</Text>
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
        <LinearGradient
          colors={['#a73737', '#7a2828']}
        >
          <View style={styles.listViewView}>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderRowView.bind(this)}
            />
          </View>
        </LinearGradient>
      </View>
    );
  }
}

class LectureScreen extends React.Component {
  static navigationOptions = {
    title: 'Lecture Details',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor:'#821c21',
      paddingTop: 20,
      height: (Platform.OS === 'ios') ? 80 : 100,
    }
  };

  render() {
    return (
      <View></View>
    );
  }
}

export default StackNavigator({
  Week: {
    screen: WeekScreen,
    headerTintColor: 'red',
  },
  Lecture: {
    screen: LectureScreen,
  }
});

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
    height: (Dimensions.get('window').height / 6),
    width: Dimensions.get('window').width,
    paddingVertical: 15,
    paddingLeft: 20,
    backgroundColor: '#fff',
  },
  card: {
    height: (Dimensions.get('window').height / 7),
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
    height: (Dimensions.get('window').height / 8),
    width: Dimensions.get('window').width - 10,
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
