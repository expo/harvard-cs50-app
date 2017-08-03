import React from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableHighlight,
  NetInfo,
} from 'react-native';
import { ScreenOrientation, FileSystem, Video } from 'expo';
import _ from 'lodash';
import * as Progress from 'react-native-progress';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import prettyMs from 'pretty-ms';

import VideoPlayer from '../components/VideoPlayer';
import Row from '../components/Row';
import Analytics from '../utils/Analytics';
import styles from '../styles/style';

var STATES = {
  NOTSTARTED: 1,
  DOWNLOADING: 2,
  STALLED: 3,
  DOWNLOADED: 4,
};

class Downloader extends React.Component {
  state = {
    progress: 0,
    timeRemaining: '10 hours',
    state: STATES.NOTSTARTED,
    totalBytes: 10000,
    currentBytes: 0,
  };

  constructor(props) {
    super(props);
    NetInfo.fetch().then(reach => {
      console.log('Initial: ' + reach);
    });
    NetInfo.addEventListener('change', reach => {
      console.log('Change: ' + reach);
      // TODO: Change to STATES.STALLED
    });
  }

  saveToDisk() {
    this.setState({ state: STATES.DOWNLOADING });

    this.setInterval(() => {
      let currentBytes = this.state.currentBytes;
      const totalBytes = this.state.totalBytes;

      currentBytes = currentBytes + 500;
      if (currentBytes > totalBytes) {
        currentBytes = totalBytes;
      }

      const speedBytesPerMs = 1;
      const timeRemainingMs = (totalBytes - currentBytes) / speedBytesPerMs;

      this.setState({
        progress: currentBytes / totalBytes,
        currentBytes: currentBytes,
        timeRemaining: prettyMs(timeRemainingMs),
        state: this.state.progress < 1 ? STATES.DOWNLOADING : STATES.DOWNLOADED,
      });
    }, 500);
  }

  render() {
    return (
      <View
        style={{
          marginLeft: 20,
          marginRight: 20,
        }}>
        {this.state.state === STATES.NOTSTARTED &&
          <View>
            <TouchableHighlight onPress={this.saveToDisk.bind(this)}>
              <Text>save for offline</Text>
            </TouchableHighlight>
          </View>}
        {this.state.state === STATES.DOWNLOADING &&
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <Text>Downloading lecture for offline viewing</Text>
              <Text>
                {this.state.timeRemaining} remaining
              </Text>
            </View>
            <View>
              <Progress.Circle size={30} progress={this.state.progress} />
            </View>
          </View>}
        {this.state.state === STATES.DOWNLOADED &&
          <View>
            <Text>Lecture available for offline viewing</Text>
          </View>}
      </View>
    );
  }
}

reactMixin(Downloader.prototype, TimerMixin);

class WeekScreen extends React.Component {
  state = {
    isPortrait: true,
    localVideoUri: null,
  };

  static navigationOptions = ({ navigation }) => ({
    title: `Week ${navigation.state.params.weekNum}`,
    headerTintColor: styles.headerTintColor,
    headerStyle: navigation.state.params.hideHeader
      ? { display: 'none', opacity: 0 }
      : styles.headerStyle,
  });

  constructor() {
    super();
    this.orientationChangeHandler = this.orientationChangeHandler.bind(this);
    this.saveToDisk = this.saveToDisk.bind(this);
  }

  saveToDisk(url) {
    console.log('Save to disk', url);
    this.savedUrl = FileSystem.documentDirectory + 'test.mp4';
    Expo.FileSystem
      .downloadAsync(
        'http://techslides.com/demos/sample-videos/small.mp4',
        this.savedUrl
      )
      .then(({ uri }) => {
        console.log('Finished downloading', uri, this.savedUrl);
        this.setState({ localVideoUri: uri });
      })
      .catch(error => {
        console.error(error);
      });
  }

  orientationChangeHandler(dims) {
    const { width, height } = dims.window;
    const isLandscape = width > height;
    this.setState({ isPortrait: !isLandscape });
    this.props.navigation.setParams({ hideHeader: isLandscape });
    ScreenOrientation.allow(ScreenOrientation.Orientation.ALL);
  }

  // Only on this screen, allow landscape orientations
  componentDidMount() {
    ScreenOrientation.allow(ScreenOrientation.Orientation.ALL);
    Dimensions.addEventListener('change', this.orientationChangeHandler);
    Analytics.track(Analytics.events.USER_WATCHED_VIDEO);
  }

  componentWillUnmount() {
    ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT);
    Dimensions.removeEventListener('change', this.orientationChangeHandler);
  }

  onButtonPress = url => {
    this.props.navigation.navigate('Link', { url: url });
  };

  onFullscreen() {
    ScreenOrientation.allow(ScreenOrientation.Orientation.LANDSCAPE);
  }

  onUnFullscreen() {
    ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT);
  }

  render() {
    const data = this.props.navigation.state.params.data;

    var linkKeys = ['slides', 'source code', 'notes'];
    var links = _.pickBy(data, (v, k) => linkKeys.includes(k));

    return (
      <View
        style={{
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexDirection: 'column',
          // paddingTop: 20,
        }}>
        <VideoPlayer
          sources={data.videos}
          id={data.title}
          isPortrait={this.state.isPortrait}
          onFullscreen={this.onFullscreen.bind(this)}
          onUnFullscreen={this.onUnFullscreen.bind(this)}
        />

        {this.state.localVideoUri &&
          <Video
            source={{
              uri: this.state.localVideoUri,
            }}
            resizeMode={Video.RESIZE_MODE_CONTAIN}
            style={{
              width: 200,
              height: 300,
            }}
            shouldPlay={true}
          />}

        <Downloader
          style={{
            display: this.state.isPortrait ? 'flex' : 'none',
            marginBottom: 40,
          }}
        />
        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexDirection: 'column',
            display: this.state.isPortrait ? 'flex' : 'none',
            marginLeft: 20,
            marginRight: 20,
          }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
            course materials
          </Text>
          {_.map(links, (url, name) => {
            return (
              <Row
                key={url}
                text={name}
                onPress={() => this.onButtonPress(url)}
              />
            );
          })}
        </View>
      </View>
    );
  }
}

export default WeekScreen;
