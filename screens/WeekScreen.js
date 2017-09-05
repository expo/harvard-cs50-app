import React from 'react';
import { Text, View, Dimensions, ScrollView } from 'react-native';
import { ScreenOrientation, Video } from 'expo';
import _ from 'lodash';
import { connect } from 'react-redux';
import VideoPlayer from 'abi-expo-videoplayer';
import Sentry from 'sentry-expo';

import Row from '../components/Row';
import Analytics from '../utils/Analytics';
import styles from '../styles/style';
import colors from '../styles/colors';
import Downloader from '../components/Downloader';
import RateSwitcher from '../components/RateSwitcher';
import config from '../utils/config';
import { STATES } from '../utils/DownloadManager';

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

  ICONS = {
    notes: 'sticky-note-o',
    slides: 'slideshare',
    'source code': 'code',
  };

  constructor(props) {
    super(props);

    const data = this.props.navigation.state.params.data;

    let links = _.pickBy(data, (v, k) =>
      ['slides', 'source code', 'notes'].includes(k)
    );

    this.state = {
      data,
      links,
      isPortrait: true,
      playback: this.props.playback,
      uri:
        this.props.offline && this.props.offline.state === STATES.DOWNLOADED
          ? this.props.offline.uri.uri
          : data.videos['240p'],
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
      this.props.updatePlaybackTime(playbackStatus.positionMillis);
    }
  }

  _errorCallback(error) {
    Sentry.captureException(error);
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
              uri: this.state.uri,
            },
            ref: component => {
              this._playbackInstance = component;
            },
            positionMillis: this.state.playback,
          }}
          isPortrait={this.state.isPortrait}
          switchToLandscape={this.switchToLandscape.bind(this)}
          switchToPortrait={this.switchToPortrait.bind(this)}
          playbackCallback={this._playbackCallback.bind(this)}
          errorCallback={this._errorCallback.bind(this)}
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
        <View
          style={{
            backgroundColor: colors.primary,
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: styles.mainViewStyle.marginLeft,
            paddingRight: styles.mainViewStyle.marginRight,
          }}>
          <Downloader
            id={this.state.data.weekNumber}
            style={{
              display: this.state.isPortrait ? 'flex' : 'none',
              marginBottom: 40,
            }}
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

          {_.map(this.state.links, (url, title) =>
            <Row
              key={title}
              text={title}
              icon={this.ICONS[title]}
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

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updatePlaybackTime: time => {
      dispatch({
        type: 'PLAYBACK',
        id: ownProps.navigation.state.params.data.weekNumber,
        time,
      });
    },
  };
};

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.navigation.state.params.data.weekNumber;
  return {
    playback: state.playback[id],
    offline: state.offline[id],
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WeekScreen);
