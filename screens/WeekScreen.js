import React from 'react';
import { Video } from 'expo';
import _ from 'lodash';
import {
  Text,
  View,
  Platform,
  TouchableHighlight,
  Dimensions,
  Button,
} from 'react-native';

class VideoSection extends React.Component {
  constructor() {
    super();
    this.saveToDisk = this.saveToDisk.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
  }

  saveToDisk(url) {
    console.log('Save to disk', url);
  }

  togglePlay() {
    console.log('Stop playing');
    this.videoEl.pauseAsync();
  }

  render() {
    console.log('SOURCES : ', this.props.sources);

    var videoWidth = Dimensions.get('window').width - 40;
    var videoHeight = videoWidth * (9 / 16);

    return (
      <View
        style={{
          marginBottom: 20,
        }}>
        <Video
          source={{
            uri: this.props.sources['240p'],
          }}
          ref={video => {
            this.videoEl = video;
          }}
          resizeMode={Video.RESIZE_MODE_CONTAIN}
          style={{
            width: videoWidth,
            height: videoHeight,
          }}
          shouldPlay={true}
        />
        <TouchableHighlight
          onPress={() => {
            this.saveToDisk(this.props.sources['240p']);
          }}>
          <Text>save for offline</Text>
        </TouchableHighlight>

        <View
          style={{
            position: 'absolute',
            top: 80,
            left: 80,
            backgroundColor: 'black',
            transform: [{ translate: [0, 0, 1] }],
          }}>
          <Button title="Play" color="white" onPress={this.togglePlay} />
        </View>
      </View>
    );
  }
}

class WeekScreen extends React.Component {
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
    this.props.navigation.navigate('Link', { url: url });
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
            marginBottom: 10,
          }}>
          {props.name}
        </Text>
      </TouchableHighlight>;

    return (
      <View
        style={{
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexDirection: 'column',
          paddingTop: 20,
          marginLeft: 20,
          marginRight: 20,
        }}>
        <VideoSection sources={data.videos} />
        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexDirection: 'column',
          }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
            course materials
          </Text>
          {_.map(links, (url, name) => {
            return <Link key={url} name={name} url={url} />;
          })}
        </View>
      </View>
    );
  }
}

export default WeekScreen;
