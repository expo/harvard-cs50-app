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
import RateSwitcher from '../components/RateSwitcher';
import config from '../utils/config';

const TRACK_IMAGE = require('../assets/videoplayer/track.png');
const THUMB_IMAGE = require('../assets/videoplayer/thumb.png');
import { Foundation, MaterialIcons } from '@expo/vector-icons';

const ICON_COLOR = colors.tertiary;
const CENTER_ICON_SIZE = 36;
const BOTTOM_BAR_ICON_SIZE = 30;

const PlayIcon = () =>
  <Foundation
    name={'play'}
    size={CENTER_ICON_SIZE}
    color={ICON_COLOR}
    style={{ textAlign: 'center' }}
  />;

const PauseIcon = () =>
  <Foundation
    name={'pause'}
    size={CENTER_ICON_SIZE}
    color={ICON_COLOR}
    style={{ textAlign: 'center' }}
  />;

export const FullscreenEnterIcon = () =>
  <MaterialIcons
    name={'fullscreen'}
    size={BOTTOM_BAR_ICON_SIZE}
    color={ICON_COLOR}
    style={{ textAlign: 'center' }}
  />;

export const FullscreenExitIcon = () =>
  <MaterialIcons
    name={'fullscreen-exit'}
    size={BOTTOM_BAR_ICON_SIZE}
    color={ICON_COLOR}
    style={{ textAlign: 'center' }}
  />;

export const ReplayIcon = () =>
  <MaterialIcons
    name={'replay'}
    size={CENTER_ICON_SIZE}
    color={ICON_COLOR}
    style={{ textAlign: 'center' }}
  />;

class WeekScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Week ${navigation.state.params.weekNum}`,
    headerTintColor: styles.headerTintColor,
    headerTitleStyle: styles.headerTitleStyle,
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

  changeRate(rate) {
    this._playbackInstance &&
      this._playbackInstance.setStatusAsync({
        rate: rate,
        shouldCorrectPitch: true,
      });
  }

  render() {
    // Video player sources
    // Example HLS url: https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8

    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'column',
          minHeight: Dimensions.get('window').height,
          backgroundColor: 'white',
        }}>
        <VideoPlayer
          videoProps={{
            shouldPlay: config.autoplayVideo,
            isMuted: config.muteVideo,
            resizeMode: Video.RESIZE_MODE_CONTAIN,
            source: {
              uri: this.state.data.videos['240p'],
            },
            ref: component => {
              this._playbackInstance = component;
            },
          }}
          isPortrait={this.state.isPortrait}
          switchToLandscape={this.switchToLandscape.bind(this)}
          switchToPortrait={this.switchToPortrait.bind(this)}
          playbackCallback={this._playbackCallback.bind(this)}
          errorCallback={this._errorCallback.bind(this)}
          playFromPositionMillis={this.state.playFromPositionMillis}
          thumbImage={THUMB_IMAGE}
          trackImage={TRACK_IMAGE}
          playIcon={PlayIcon}
          pauseIcon={PauseIcon}
          fullscreenEnterIcon={FullscreenEnterIcon}
          fullscreenExitIcon={FullscreenExitIcon}
          replayIcon={ReplayIcon}
          textStyle={{
            color: colors.tertiary,
            fontFamily: 'custom-regular',
            textAlign: 'left',
            fontSize: 12,
          }}
        />
        <View style={{ backgroundColor: colors.primary, marginBottom: 20 }}>
          <Downloader
            id={this.state.data.title}
            style={[
              {
                display: this.state.isPortrait ? 'flex' : 'none',
                marginBottom: 40,
                marginLeft: 30,
              },
              styles.layoutStyle,
            ]}
          />
          <RateSwitcher changeRate={this.changeRate.bind(this)} />
        </View>
        <ScrollView
          contentContainerStyle={{
            justifyContent: 'space-between',
            flexDirection: 'column',
            display: this.state.isPortrait ? 'flex' : 'none',
            backgroundColor: 'white',
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
