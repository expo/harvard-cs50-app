import React from 'react';
import { Video } from 'expo';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  Platform,
  TouchableHighlight,
} from 'react-native';

class LectureScreen extends React.Component {
  state = {
    url: null,
    videoIndex: 8,
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

  onButtonPress = url => {
    this.props.navigation.navigate('Web', { url: url });
  };

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
    //this.setVideoIndex(params);

    const linkStyle = {
      fontSize: 25,
      color: 'black',
      fontWeight: 'bold',
      backgroundColor: 'transparent',
      alignSelf: 'center',
    };

    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 20,
        }}>
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
              uri: params.data.Videos['240p'],
            }}
            resizeMode={Video.RESIZE_MODE_CONTAIN}
            style={{ width: 300, height: 300 }}
            shouldPlay={true}
          />
        </View>
        <TouchableHighlight
          onPress={() => {
            this.onButtonPress(params.data.Notes);
          }}>
          <Text style={linkStyle}>
            Notes for {params.data.title}
          </Text>
        </TouchableHighlight>
        <Text />
        <Text />
        <TouchableHighlight
          onPress={() => {
            this.onButtonPress(this._getPSetURL(params.data.Notes));
          }}>
          <Text style={linkStyle}>
            Problem Set for {params.data.title}
          </Text>
        </TouchableHighlight>
        <Text />
        <Text />
        <TouchableHighlight
          onPress={() => {
            this.onButtonPress(params.data['Source Code']);
          }}>
          <Text style={linkStyle}>
            Source Code for {params.data.title}
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

export default LectureScreen;
