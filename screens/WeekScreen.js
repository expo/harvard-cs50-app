import React from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableHighlight,
  NetInfo,
  ScrollView,
} from 'react-native';
import { ScreenOrientation, FileSystem } from 'expo';
import _ from 'lodash';
import * as Progress from 'react-native-progress';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import prettyMs from 'pretty-ms';

import VideoPlayer from '../components/VideoPlayer';
import Row from '../components/Row';
import Analytics from '../utils/Analytics';
import styles, { colors, fontSize } from '../styles/style';
import StoredValue from '../utils/StoredValue';

import { Foundation, MaterialIcons } from '@expo/vector-icons';

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
      // console.log('Initial: ' + reach);
    });
    NetInfo.addEventListener('change', reach => {
      // console.log('Change: ' + reach);
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
  static navigationOptions = ({ navigation }) => ({
    title: `Week ${navigation.state.params.weekNum}`,
    headerTintColor: styles.headerTintColor,
    headerStyle: navigation.state.params.hideHeader
      ? { display: 'none', opacity: 0 }
      : styles.headerStyle,
  });

  constructor(props) {
    super(props);

    const data = this.props.navigation.state.params.data;
    const linkKeys = ['slides', 'source code', 'notes'];
    const links = _.pickBy(data, (v, k) => linkKeys.includes(k));

    const ICONS = {
      notes: 'sticky-note-o',
      slides: 'slideshare',
      'source code': 'code',
    };

    const linksArr = _.map(links, (url, title) => ({
      title,
      url,
      icon: ICONS[title],
    }));

    this.state = {
      isPortrait: true,
      localVideoUri: null,
      data,
      links,
      linksArr,
    };

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
    this.storedPlaybackTime = new StoredValue(
      this.state.data.title + ':playbackTime'
    );

    this.storedPlaybackTime
      .get()
      .then(value => {
        if (value !== null) {
          this.setState({ playFromPositionMillis: parseInt(value) });
        }
      })
      .catch(e => {
        console.log('Error retrieving stored playback value', e);
      });
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

  _playbackCallback(playbackStatus) {
    if (playbackStatus.isLoaded) {
      var positionMillis = playbackStatus.positionMillis.toString();
      if (this.storedPlaybackTime) {
        this.storedPlaybackTime
          .set(positionMillis)
          .then(val => {})
          .catch(error => {
            console.log('Error in saving stored value', error);
            // TODO: Send to Sentry
          });
      }
    }
  }

  render() {
    // Video player sources
    // Example HLS url: https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8

    const PlayIcon = () =>
      <Foundation name={'asterisk'} size={36} color={colors.complementary} />;

    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}>
        <VideoPlayer
          uri={this.state.data.videos['240p']}
          isPortrait={this.state.isPortrait}
          onFullscreen={this.onFullscreen.bind(this)}
          onUnFullscreen={this.onUnFullscreen.bind(this)}
          playbackCallback={this._playbackCallback.bind(this)}
          playFromPositionMillis={this.state.playFromPositionMillis}
          /* playIcon={PlayIcon} */
        />
        <View>
          <Downloader
            style={{
              display: this.state.isPortrait ? 'flex' : 'none',
              marginBottom: 40,
            }}
          />
          <View>
            <Text>Switch playback rate</Text>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            justifyContent: 'space-between',
            flexDirection: 'column',
            display: this.state.isPortrait ? 'flex' : 'none',
          }}>
          <Text style={[styles.h1Style, styles.mainViewStyle]}>
            Course Materials
          </Text>

          {this.state.linksArr.map(({ title, url, icon }) =>
            <Row
              key={title}
              text={title}
              icon={icon}
              onPress={() => this.onButtonPress(url)}
              style={{
                alignSelf: 'stretch',
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            />
          )}
        </ScrollView>
      </View>
    );
  }
}

export default WeekScreen;
