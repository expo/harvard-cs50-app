import React from 'react';
import { Audio, Video } from 'expo';
import {
  View,
  Dimensions,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Animated,
  Text,
  ActivityIndicator,
  Slider,
} from 'react-native';
import { Foundation, MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

import config from '../../utils/config';
import styles from '../../styles/style';
import colors from '../../styles/colors';

var CONTROL_STATES = {
  SHOWN: 1,
  SHOWING: 2,
  HIDDEN: 3,
  HIDING: 4,
};

const PlayIcon = () =>
  <Foundation
    name={'play'}
    size={36}
    color={colors.complementary}
    style={{ textAlign: 'center' }}
  />;

const PauseIcon = () =>
  <Foundation
    name={'pause'}
    size={36}
    color={colors.complementary}
    style={{ textAlign: 'center' }}
  />;

const Spinner = () =>
  <ActivityIndicator color={colors.complementary} size={'large'} />;

const FullscreenEnterIcon = () =>
  <MaterialIcons
    name={'fullscreen'}
    size={30}
    color={colors.complementary}
    style={{ textAlign: 'center' }}
  />;

const FullscreenExitIcon = () =>
  <MaterialIcons
    name={'fullscreen-exit'}
    size={30}
    color={colors.complementary}
    style={{ textAlign: 'center' }}
  />;

const ReplayIcon = () =>
  <MaterialIcons
    name={'replay'}
    size={30}
    color={colors.complementary}
    style={{ textAlign: 'center' }}
  />;

const TRACK_IMAGE = require('../../assets/icons/track.png');
const THUMB_IMAGE = require('../../assets/icons/thumb.png');

var PLAYBACK_STATES = {
  LOADING: 'LOADING',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  BUFFERING: 'BUFFERING',
  ERROR: 'ERROR',
  ENDED: 'ENDED',
};

var SEEK_STATES = {
  NOT_SEEKING: 'NOT_SEEKING',
  SEEKING: 'SEEKING',
  SEEKED: 'SEEKED',
};

const UPDATE_DELAY = 200;

export default class VideoPlayer extends React.Component {
  static propTypes = {
    /**
   * How long should the fadeIn animation for the controls run? (in milliseconds)
   * Default value is 200.
   *
   */
    showingDuration: PropTypes.number,
    // TODO: Fill out remaining prop types
    /**
     * Callback to get `playbackStatus` objects for the underlying video element
     */
    playbackCallback: PropTypes.func,
    // playIcon: PropTypes.element,

    errorCallback: PropTypes.func,

    switchToLandscape: PropTypes.func,
    switchToPortrait: PropTypes.func,
  };

  static defaultProps = {
    showingDuration: 200,
    hidingFastDuration: 200,
    hidingSlowDuration: 1000,
    hidingTimerDuration: 4000,
    playIcon: PlayIcon,
    pauseIcon: PauseIcon,
    spinner: Spinner,
    fullscreenEnterIcon: FullscreenEnterIcon,
    fullscreenExitIcon: FullscreenExitIcon,
    replayIcon: ReplayIcon,
    trackImage: TRACK_IMAGE,
    thumbImage: THUMB_IMAGE,
    errorCallback: error => {
      console.log('Error: ', error.message, error.type, error.obj);
    },
  };

  constructor() {
    super();
    this.state = {
      // Playback state
      playbackState: PLAYBACK_STATES.LOADING,
      lastPlaybackStateUpdate: Date.now(),

      //Seeking state
      seekState: SEEK_STATES.NOT_SEEKING,
      lastSeekStateUpdate: Date.now(),

      // State comes from the playbackCallback
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
      shouldPlay: false,

      // Error message if we are in PLAYBACK_STATES.ERROR
      error: null,

      // Controls display state
      controlsOpacity: new Animated.Value(0),
      controlsState: CONTROL_STATES.HIDDEN,
    };
  }

  async componentDidMount() {
    // Set audio mode to play even in silent mode (like the YouTube app)
    try {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX, // TODO(Abi): Switch back to INTERRUPTION_MODE_IOS_DO_NOT_MIX
        playsInSilentModeIOS: config.muteVideo ? false : true,
        shouldDuckAndroid: true, // TODO(Abi): Is this the common behavior on Android?
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      });
    } catch (e) {
      this.props.errorCallback({
        type: 'NON_FATAL',
        message: 'Audio mode intialization issue',
        obj: e,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.playFromPositionMillis !== this.props.playFromPositionMillis &&
      config.autoplayVideo &&
      this._playbackInstance !== null
    ) {
      // TODO: Ignore errors here?
      this._playbackInstance.playFromPositionAsync(
        nextProps.playFromPositionMillis
      );
    }
  }

  componentWillUnmount() {
    this.clearTimeout(this.controlsTimer);
  }

  // Handle events during playback

  _setPlaybackState(playbackState) {
    console.log(
      '[playback]',
      this.state.playbackState,
      ' -> ',
      playbackState,
      ' [seek] ',
      this.state.seekState,
      ' [shouldPlay] ',
      this.state.shouldPlay
    );
    this.setState({ playbackState, lastPlaybackStateUpdate: Date.now() });
  }

  _setSeekState(seekState) {
    console.log(
      '[seek]',
      this.state.seekState,
      ' -> ',
      seekState,
      ' [playback] ',
      this.state.playbackState,
      ' [shouldPlay] ',
      this.state.shouldPlay
    );
    this.setState({ seekState, lastSeekStateUpdate: Date.now() });
    // Don't hide the controls/seekbar when the state is seeking
    if (seekState === SEEK_STATES.SEEKING) {
      this.controlsTimer && this.clearTimeout(this.controlsTimer);
    } else {
      this._resetControlsTimer();
    }
  }

  _playbackCallback(playbackStatus) {
    try {
      this.props.playbackCallback &&
        this.props.playbackCallback(playbackStatus);
    } catch (e) {
      // TODO
      console.error('Error in user playbackCallback', e);
    }

    if (!playbackStatus.isLoaded) {
      if (playbackStatus.error) {
        this._setPlaybackState(PLAYBACK_STATES.ERROR);
        this.setState({
          error: `Encountered a fatal error during playback: ${playbackStatus.error}`,
        });
        this.props.onErrorOrWarning && this.props.onErrorOrWarning();
        // TODO: Send to Sentry
      }
    } else {
      let newPlaybackState = this.state.playbackState;

      if (
        this.state.seekState === SEEK_STATES.NOT_SEEKING &&
        this.state.playbackState !== PLAYBACK_STATES.ENDED
      ) {
        if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
          newPlaybackState = PLAYBACK_STATES.ENDED;
        } else {
          if (playbackStatus.isPlaying) {
            newPlaybackState = PLAYBACK_STATES.PLAYING;
          } else {
            if (playbackStatus.isBuffering) {
              newPlaybackState = PLAYBACK_STATES.BUFFERING;
            } else {
              newPlaybackState = PLAYBACK_STATES.PAUSED;
            }
          }
        }
      }

      if (this.state.playbackState !== newPlaybackState) {
        this._setPlaybackState(newPlaybackState);
      }

      this.setState({
        playbackInstancePosition: playbackStatus.positionMillis,
        playbackInstanceDuration: playbackStatus.durationMillis,
        shouldPlay: playbackStatus.shouldPlay,
      });
    }
  }

  // Seeking
  _getSeekSliderPosition() {
    if (
      this._playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return (
        this.state.playbackInstancePosition /
        this.state.playbackInstanceDuration
      );
    }
    return 0;
  }

  _onSeekSliderValueChange = () => {
    if (
      this._playbackInstance != null &&
      this.state.seekState !== SEEK_STATES.SEEKING
    ) {
      this._setSeekState(SEEK_STATES.SEEKING);
      // A seek might have finished but since we are not in NOT_SEEKING yet, the `shouldPlay` flag
      // is still false, but we really want it be the stored value from before the previous seek
      this.shouldPlayAtEndOfSeek =
        this.state.seekState === SEEK_STATES.SEEKED
          ? this.shouldPlayAtEndOfSeek
          : this.state.shouldPlay;
      // Pause the video
      this._playbackInstance.setStatusAsync({ shouldPlay: false });
    }
  };

  _onSeekSliderSlidingComplete = async value => {
    if (this._playbackInstance != null) {
      this._setSeekState(SEEK_STATES.SEEKED);
      this._setPlaybackState(PLAYBACK_STATES.BUFFERING);
      this._playbackInstance
        .setStatusAsync({
          positionMillis: value * this.state.playbackInstanceDuration,
          shouldPlay: this.shouldPlayAtEndOfSeek,
        })
        .then(playbackStatus => {
          this._setSeekState(SEEK_STATES.NOT_SEEKING);
          let newPlaybackState = PLAYBACK_STATES.BUFFERING;
          if (playbackStatus.isPlaying) {
            newPlaybackState = PLAYBACK_STATES.PLAYING;
          } else {
            if (playbackStatus.isBuffering) {
              newPlaybackState = PLAYBACK_STATES.BUFFERING;
            } else {
              newPlaybackState = PLAYBACK_STATES.PAUSED;
            }
          }
          this._setPlaybackState(newPlaybackState);
        })
        .catch(message => {
          console.log('Error while seeking', message);
        });
    }
  };

  _onSeekBarTap = evt => {
    const value = evt.nativeEvent.locationX / this.state.sliderWidth;
    this._onSeekSliderValueChange();
    this._onSeekSliderSlidingComplete(value);
  };

  _onSliderLayout = evt => {
    this.setState({ sliderWidth: evt.nativeEvent.layout.width });
  };

  // Controls view
  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = number => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  }

  // Controls Behavior
  _replay() {
    this._playbackInstance
      .setStatusAsync({
        shouldPlay: true,
        positionMillis: 0,
      })
      .then(() => {
        this.setState({ playbackState: PLAYBACK_STATES.PLAYING });
      });
  }

  _togglePlay() {
    this.state.playbackState == PLAYBACK_STATES.PLAYING
      ? this._playbackInstance.setStatusAsync({ shouldPlay: false })
      : this._playbackInstance.setStatusAsync({ shouldPlay: true });
  }

  _toggleControls = () => {
    switch (this.state.controlsState) {
      case CONTROL_STATES.SHOWN:
        this.setState({ controlsState: CONTROL_STATES.HIDING });
        this._hideControls(true);
        break;
      case CONTROL_STATES.HIDDEN:
        this._showControls();
        this.setState({ controlsState: CONTROL_STATES.SHOWING });
        break;
      case CONTROL_STATES.HIDING:
        this.setState({ controlsState: CONTROL_STATES.SHOWING });
        this._showControls();
        break;
      case CONTROL_STATES.SHOWING:
        break;
    }
  };

  _showControls = () => {
    this.showingAnimation = Animated.timing(this.state.controlsOpacity, {
      toValue: 1,
      duration: this.props.showingAnimation,
      useNativeDriver: true,
    });

    this.showingAnimation.start(({ finished }) => {
      if (finished) {
        this.setState({ controlsState: CONTROL_STATES.SHOWN });
        this._resetControlsTimer();
      }
    });
  };

  _hideControls = (immediate = false) => {
    if (this.controlsTimer) {
      this.clearTimeout(this.controlsTimer);
    }
    this.hideAnimation = Animated.timing(this.state.controlsOpacity, {
      toValue: 0,
      duration: immediate
        ? this.props.hidingFastDuration
        : this.props.hidingSlowDuration,
      useNativeDriver: true,
    });
    this.hideAnimation.start(({ finished }) => {
      if (finished) {
        this.setState({ controlsState: CONTROL_STATES.HIDDEN });
      }
    });
  };

  _onTimerDone = () => {
    this.setState({ controlsState: CONTROL_STATES.HIDING });
    this._hideControls();
  };

  _resetControlsTimer = () => {
    // TODO: Handle the fact that a control can be touched, when in CONTROL_STATES.HIDING
    if (this.controlsTimer) {
      this.clearTimeout(this.controlsTimer);
    }
    this.controlsTimer = this.setTimeout(
      this._onTimerDone.bind(this),
      this.props.hidingTimerDuration
    );
  };

  render() {
    const videoWidth = Dimensions.get('window').width;
    const videoHeight = videoWidth * (9 / 16);
    const centerIconWidth = 60;

    const overlayTextStyle = {
      color: colors.complementary,
      fontFamily: 'roboto-regular',
      fontSize: styles.fontSize(0),
    };

    const PlayIcon = this.props.playIcon;
    const PauseIcon = this.props.pauseIcon;
    const Spinner = this.props.spinner;
    const FullscreenEnterIcon = this.props.fullscreenEnterIcon;
    const FullscreenExitIcon = this.props.fullscreenExitIcon;
    const ReplayIcon = this.props.replayIcon;

    const Control = ({ callback, children, center, ...otherProps }) =>
      <TouchableHighlight
        {...otherProps}
        underlayColor="transparent"
        hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
        activeOpacity={0.3}
        onPress={() => {
          this._resetControlsTimer();
          callback();
        }}
        style={
          center
            ? {
                width: centerIconWidth,
                height: centerIconWidth,
              }
            : {}
        }>
        <View
          style={
            center
              ? {
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  justifyContent: 'center',
                  borderRadius: centerIconWidth,
                  flex: 1,
                }
              : {}
          }>
          {children}
        </View>
      </TouchableHighlight>;

    const CenterIcon = ({ children }) =>
      <View
        style={{
          position: 'absolute',
          left: (videoWidth - centerIconWidth) / 2,
          top: (videoHeight - centerIconWidth) / 2,
        }}>
        {children}
      </View>;

    const ErrorText = ({ text }) =>
      <View
        style={{
          position: 'absolute',
          top: videoHeight / 2,
          width: videoWidth,
        }}>
        <Text style={[overlayTextStyle, { textAlign: 'center' }]}>
          {text}
        </Text>
      </View>;

    return (
      <TouchableWithoutFeedback onPress={this._toggleControls.bind(this)}>
        <View
          style={{
            marginBottom: 20,
            backgroundColor: 'black',
          }}>
          <Video
            source={{
              uri: this.props.uri,
            }}
            ref={component => (this._playbackInstance = component)}
            resizeMode={Video.RESIZE_MODE_CONTAIN}
            callback={this._playbackCallback.bind(this)}
            style={{
              width: videoWidth,
              height: videoHeight,
            }}
            shouldPlay={config.autoplayVideo}
            isMuted={config.muteVideo}
          />

          {/* <View
            style={{
              width: videoWidth,
              height: videoHeight,
            }}
          /> */}

          {((this.state.playbackState == PLAYBACK_STATES.BUFFERING &&
            Date.now() - this.state.lastPlaybackStateUpdate > UPDATE_DELAY) ||
            this.state.playbackState == PLAYBACK_STATES.LOADING) &&
            <CenterIcon>
              <Spinner />
            </CenterIcon>}

          {this.state.seekState == SEEK_STATES.NOT_SEEKING &&
            (this.state.playbackState == PLAYBACK_STATES.PLAYING ||
              this.state.playbackState == PLAYBACK_STATES.PAUSED) &&
            <Animated.View
              pointerEvents={
                this.state.controlsState === CONTROL_STATES.HIDDEN
                  ? 'none'
                  : 'auto'
              }
              style={{
                opacity: this.state.controlsOpacity,
                position: 'absolute',
                left: (videoWidth - centerIconWidth) / 2,
                top: (videoHeight - centerIconWidth) / 2,
              }}>
              <Control center={true} callback={this._togglePlay.bind(this)}>
                {this.state.playbackState == PLAYBACK_STATES.PLAYING
                  ? <PauseIcon />
                  : <PlayIcon />}
              </Control>
            </Animated.View>}

          {this.state.playbackState == PLAYBACK_STATES.ENDED &&
            <CenterIcon>
              <Control center={true} callback={this._replay.bind(this)}>
                <ReplayIcon />
              </Control>
            </CenterIcon>}

          {this.state.playbackState == PLAYBACK_STATES.ERROR &&
            <ErrorText text={this.state.error} />}

          <Animated.View
            pointerEvents={
              this.state.controlsState === CONTROL_STATES.HIDDEN
                ? 'none'
                : 'auto'
            }
            style={{
              alignItems: 'stretch',
              flex: 2,
              justifyContent: 'flex-start',
              width: videoWidth,
              position: 'absolute',
              bottom: 0,
              opacity: this.state.controlsOpacity,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={[overlayTextStyle, { marginLeft: 5 }]}>
                {this._getMMSSFromMillis(this.state.playbackInstancePosition)}
              </Text>
              <TouchableWithoutFeedback
                onLayout={this._onSliderLayout.bind(this)}
                onPress={this._onSeekBarTap.bind(this)}>
                <Slider
                  style={{ flex: 2, marginRight: 10, marginLeft: 10 }}
                  trackImage={this.props.trackImage}
                  thumbImage={this.props.thumbImage}
                  value={this._getSeekSliderPosition()}
                  onValueChange={this._onSeekSliderValueChange}
                  onSlidingComplete={this._onSeekSliderSlidingComplete}
                  disabled={this.state.isLoading}
                />
              </TouchableWithoutFeedback>
              <Text style={[overlayTextStyle, { marginRight: 5 }]}>
                {this._getMMSSFromMillis(this.state.playbackInstanceDuration)}
              </Text>
              <Control
                callback={() => {
                  this.props.isPortrait
                    ? this.props.switchToLandscape()
                    : this.props.switchToPortrait();
                }}>
                {this.props.isPortrait
                  ? <FullscreenEnterIcon />
                  : <FullscreenExitIcon />}
              </Control>
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

reactMixin(VideoPlayer.prototype, TimerMixin);
