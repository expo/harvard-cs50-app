import React from 'react';
import { Video } from 'expo';
import _ from 'lodash';
import { Text, View, Platform, TouchableHighlight } from 'react-native';

class VideoSection extends React.Component {
  render() {
    console.log('SOURCES : ', this.props.sources);
    return (
      <View
        style={{
          flex: 1,
          padding: 10,
          marginTop: 80,
          alignItems: 'center',
          justifyContent: 'center',
          width: 300,
          height: 300,
          borderColor: 'black',
          borderWidth: 2,
        }}>
        <Video
          source={{
            uri: this.props.sources['240p'],
          }}
          resizeMode={Video.RESIZE_MODE_CONTAIN}
          style={{ width: 300, height: 300 }}
          shouldPlay={true}
        />
      </View>
    );
  }
}

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

  // TODO: Move this to teh data processing layer
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
    const data = params.data;

    var linkKeys = ['slides', 'source code', 'notes'];
    var links = _.pickBy(data, (v, k) => linkKeys.includes(k));

    const Link = props =>
      <TouchableHighlight
        onPress={() => {
          this.onButtonPress(props.url);
        }}>
        <Text
          style={{
            fontSize: 20,
            color: 'black',
          }}>
          {props.name}
        </Text>
      </TouchableHighlight>;

    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 20,
        }}>
        <VideoSection sources={data.videos} />
        <Text> course materials</Text>
        {_.map(links, (url, name) => {
          return <Link key={url} name={name} url={url} />;
        })}
      </View>
    );
  }
}

export default LectureScreen;
