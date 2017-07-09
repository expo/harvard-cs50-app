import React from 'react';
import { Video, ScreenOrientation } from 'expo';
import _ from 'lodash';
import {
  Text,
  View,
  Platform,
  TouchableHighlight,
  Dimensions,
  Button,
  ScrollView,
} from 'react-native';

class VideoPlayer extends React.Component {
  constructor() {
    super();
    this.togglePlay = this.togglePlay.bind(this);
  }

  togglePlay() {
    console.log('Stop playing');
    this.videoEl.pauseAsync();
  }

  render() {
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
    isPortrait: true,
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

  constructor() {
    super();
    this.orientationChangeHandler = this.orientationChangeHandler.bind(this);
    this.saveToDisk = this.saveToDisk.bind(this);
  }

  saveToDisk(url) {
    console.log('Save to disk', url);
  }

  orientationChangeHandler(dims) {
    const { width, height } = dims.window;
    this.setState({ isPortrait: height > width });
  }

  // Only on this screen, allow landscape orientations
  componentDidMount() {
    ScreenOrientation.allow(ScreenOrientation.Orientation.ALL);
    Dimensions.addEventListener('change', this.orientationChangeHandler);
  }

  componentWillUnmount() {
    ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT);
    Dimensions.removeEventListener('change', this.orientationChangeHandler);
  }

  onButtonPress = url => {
    this.props.navigation.navigate('Link', { url: url });
  };

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
      <ScrollView
        containerStyle={{
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexDirection: 'column',
          paddingTop: 20,
          marginLeft: 20,
          marginRight: 20,
        }}>
        <View>
          <VideoPlayer
            sources={data.videos}
            isPortrait={this.state.isPortrait}
          />
          <TouchableHighlight
            style={{ display: this.state.isPortrait ? 'flex' : 'none' }}
            onPress={() => {
              this.saveToDisk(this.props.sources['240p']);
            }}>
            <Text>
              save for offline {this.state.isPortrait.toString()}
            </Text>
          </TouchableHighlight>
        </View>
        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexDirection: 'column',
            display: this.state.isPortrait ? 'flex' : 'none',
          }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
            course materials
          </Text>
          {_.map(links, (url, name) => {
            return <Link key={url} name={name} url={url} />;
          })}
        </View>
      </ScrollView>
    );
  }
}

export default WeekScreen;
