import React from 'react';
import { Text, View, Dimensions, ScrollView } from 'react-native';
import { ScreenOrientation, Video } from 'expo';
import _ from 'lodash';
import VideoPlayer from 'abi-expo-videoplayer';

import Row from '../components/Row';
import Analytics from '../utils/Analytics';
import styles from '../styles/style';
import colors from '../styles/colors';
import StoredValue from '../utils/StoredValue';
import Downloader from '../components/Downloader';
import config from '../utils/config';

import { Foundation } from '@expo/vector-icons';

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
  }

  orientationChangeHandler(dims) {
    const { width, height } = dims.window;
    const isLandscape = width > height;
    this.setState({ isPortrait: !isLandscape });
    this.props.navigation.setParams({ hideHeader: isLandscape });
    // TODO: Why?
    ScreenOrientation.allow(ScreenOrientation.Orientation.ALL);
  }

  // Only on this screen, allow landscape orientations
  componentDidMount() {
    ScreenOrientation.allow(ScreenOrientation.Orientation.ALL);
    Dimensions.addEventListener(
      'change',
      this.orientationChangeHandler.bind(this)
    );
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

  switchToLandscape() {
    ScreenOrientation.allow(ScreenOrientation.Orientation.LANDSCAPE);
  }

  switchToPortrait() {
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

  _errorCallback(error) {
    // TODO: Send to Sentry
    console.log('Error: ', error.message, error.type, error.obj);
  }

  onRowPress = (url, title) => {
    this.props.navigation.navigate('Link', { url, title: _.capitalize(title) });
  };

  render() {
    // Video player sources
    // Example HLS url: https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8

    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'column',
          minHeight: Dimensions.get('window').height,
        }}>
        <VideoPlayer
          videoProps={{
            shouldPlay: config.autoplayVideo,
            isMuted: config.muteVideo,
            resizeMode: Video.RESIZE_MODE_CONTAIN,
            source: {
              uri: this.state.data.videos['240p'],
            },
          }}
          isPortrait={this.state.isPortrait}
          switchToLandscape={this.switchToLandscape.bind(this)}
          switchToPortrait={this.switchToPortrait.bind(this)}
          playbackCallback={this._playbackCallback.bind(this)}
          errorCallback={this._errorCallback.bind(this)}
          playFromPositionMillis={this.state.playFromPositionMillis}
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
          <Text
            style={[
              styles.h1Style,
              styles.mainViewStyle,
              { marginBottom: 30 },
            ]}>
            Course Materials
          </Text>

          {this.state.linksArr.map(({ title, url, icon }) =>
            <Row
              key={title}
              text={title}
              icon={icon}
              onPress={this.onRowPress.bind(this, url, title)}
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
