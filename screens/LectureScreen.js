import React from 'react';
import { Video } from 'expo';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Platform,
  TouchableHighlight,
  Image,
} from 'react-native';

class LectureScreen extends React.Component {
  state = {
    url: null,
  };

  static navigationOptions = {
    title: 'Week Details',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#821c21',
      paddingTop: 20,
      height: Platform.OS === 'ios' ? 80 : 100,
    },
  };

  renderRowView(rowData) {
    return (
      <Text>
        {rowData.children[0].value}
      </Text>
    );
  }

  onButtonPress = url => {
    this.props.navigation.navigate('Web', { url: url });
  };

  // Jeff: I realised that theres a seperate xml for psets after i coded this. will fix later
  _getPSetURL(url) {
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
  }

  render() {
    const { params } = this.props.navigation.state;

    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 20,
        }}>
        <TouchableHighlight
          onPress={() => {
            this.onButtonPress(params.data[3].children[1].attributes.href);
          }}>
          <Image
            style={styles.lectureImage}
            source={require('../assets/notes.png')}>
            <Text style={styles.lectureText}>
              Notes for {params.data[0].value}
            </Text>
          </Image>
        </TouchableHighlight>
        <Text />
        <Text />
        <TouchableHighlight
          onPress={() => {
            this.onButtonPress(
              this._getPSetURL(params.data[3].children[1].attributes.href)
            );
          }}>
          <Image
            style={styles.lectureImage}
            source={require('../assets/pset.png')}>
            <Text style={styles.lectureText}>
              Problem Set for {params.data[0].value}
            </Text>
          </Image>
        </TouchableHighlight>
        <Text />
        <Text />
        <TouchableHighlight
          onPress={() => {
            this.onButtonPress(params.data[5].children[1].attributes.href);
          }}>
          <Image
            style={styles.lectureImage}
            source={require('../assets/scode.jpg')}>
            <Text style={styles.lectureText}>
              Source Code for {params.data[0].value}
            </Text>
          </Image>
        </TouchableHighlight>

        <View
          style={{
            flex: 1,
            padding: 10,
            marginTop: 80,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Video
            source={{
              uri: params.data[8].children[1].children[2].attributes.href,
            }}
            resizeMode={Video.RESIZE_MODE_CONTAIN}
            style={{ width: 300, height: 300 }}
            shouldPlay={true}
          />
        </View>
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
  lectureText: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    alignSelf: 'center',
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
  lectureImage: {
    height: Dimensions.get('window').height / 7,
    width: Dimensions.get('window').width - 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  button: {
    height: 45,
    alignSelf: 'stretch',
    backgroundColor: '#05A5D1',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FAFAFA',
  },
});

export default LectureScreen;
