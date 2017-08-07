import React from 'react';
import { Audio, Video, Asset } from 'expo';
import _ from 'lodash';
import {
  View,
  Dimensions,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Animated,
  Text,
  Slider,
  Easing,
  ActivityIndicator,
  Platform,
} from 'react-native';
import StoredValue from '../utils/StoredValue';
import config from '../utils/config';
import { colors, fontSize } from '../styles/style';

var CONTROL_STATES = {
  SHOWN: 1,
  SHOWING: 2,
  HIDDEN: 3,
  HIDING: 4,
};

export default class VideoPlayer extends React.Component {
  static defaultProps = {
    showingDuration: 200,
    hidingFastDuration: 200,
    hidingSlowDuration: 1000,
    hidingTimerDuration: 4000,
  };

  constructor() {
    super();
    this._togglePlay = this._togglePlay.bind(this);
    this._playbackCallback = this._playbackCallback.bind(this);
    this.state = {
      muted: false,
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isBuffering: false,
      isLoading: true,
      controlsActive: false,
      volume: 1.0,
      poster: false,
      fullscreen: false,
      isSeeking: false,
      controlsOpacity: new Animated.Value(0),
      controlsState: CONTROL_STATES.HIDDEN,
    };
  }

  async componentDidMount() {
    // Set audio mode to play even in silent mode (like the YouTube app)
    // TODO: Handle rejection of the returned promise
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX, // TODO(Abi): Switch back to INTERRUPTION_MODE_IOS_DO_NOT_MIX
      playsInSilentModeIOS: config.muteVideo ? false : true,
      shouldDuckAndroid: true, // TODO(Abi): Is this the common behavior on Android?
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });

    this.storedPlaybackTime = new StoredValue(this.props.id + ':playbackTime');

    try {
      const value = await this.storedPlaybackTime.get();
      if (value !== null) {
        console.log('Setting the playback start to ', value);
        if (config.autoplayVideo) {
          this._playbackObject.playFromPositionAsync(parseInt(value));
          this._playbackObject.setStatusAsync({
            isMuted: config.muteVideo ? true : false,
          }); // TODO: Convert to settings
        }
      } else {
        console.log('No storedPlaybackTime exists.');
      }
    } catch (error) {
      console.log(error);
      // Don't do anything in the UI because this just means the user hasn't previously watched this video
      // TODO: Send error using Sentry
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isPortrait !== this.props.isPortrait) {
      this.setState({ fullscreen: !nextProps.isPortrait });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.controlsTimer);
  }

  _playbackCallback(playbackStatus) {
    if (!playbackStatus.isLoaded) {
      // Update your UI for the unloaded state
      if (playbackStatus.error) {
        console.log(
          `Encountered a fatal error during playback: ${playbackStatus.error}`
        );
      }
    } else {
      this.setState({
        playbackInstancePosition: playbackStatus.positionMillis,
        playbackInstanceDuration: playbackStatus.durationMillis,
        isLoading: false,
        shouldPlay: playbackStatus.shouldPlay,
        isPlaying: playbackStatus.isPlaying,
        isBuffering: playbackStatus.isBuffering,
        muted: playbackStatus.isMuted,
        volume: playbackStatus.volume,
      });

      var currentPos = playbackStatus.positionMillis.toString();
      this.storedPlaybackTime
        .set(currentPos)
        .then(val => {
          //   console.log('Saved successfully to AsyncStorage', val);
        })
        .catch(error => {
          console.log('Error in saving stored value', error);
        });

      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        // The player has just finished playing and will stop. Maybe you want to play something else?
      }
    }
  }

  // Seeking
  _getSeekSliderPosition() {
    if (
      this._playbackObject != null &&
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

  _onSeekSliderValueChange = value => {
    if (this._playbackObject != null && !this.state.isSeeking) {
      this.setState({ isSeeking: true });
      this.setState({ shouldPlayAtEndOfSeek: this.state.shouldPlay });
      this._playbackObject.pauseAsync();
    }
  };

  _onSeekSliderSlidingComplete = async value => {
    if (this._playbackObject != null) {
      this.setState({ isSeeking: false });
      const seekPosition = value * this.state.playbackInstanceDuration;
      if (this.state.shouldPlayAtEndOfSeek) {
        this._playbackObject.playFromPositionAsync(seekPosition);
      } else {
        this._playbackObject.setPositionAsync(seekPosition);
      }
    }
  };

  _onSeekBarTap = value => {};

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

  _togglePlay() {
    this.state.isPlaying
      ? this._playbackObject.pauseAsync()
      : this._playbackObject.playAsync();
  }

  _toggleControls = () => {
    console.log('view tapped outside an actual control');
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
        this.controlsTimer = setTimeout(
          this._onTimerDone.bind(this),
          this.props.hidingTimerDuration
        );
      }
    });
  };

  _hideControls = (immediate = false) => {
    if (this.controlsTimer) {
      clearTimeout(this.controlsTimer);
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
      clearTimeout(this.controlsTimer);
    }
    this.controlsTimer = setTimeout(
      this._onTimerDone.bind(this),
      this.props.hidingTimerDuration
    );
  };

  render() {
    const videoWidth = Dimensions.get('window').width;
    const videoHeight = videoWidth * (9 / 16);
    const centerIconWidth = 48;

    const showSpinner =
      this.state.isBuffering ||
      this.state.isLoading ||
      (this.state.shouldPlay && !this.state.isPlaying);

    const hidePlayPauseButton = this.state.isSeeking;

    const showPauseButton =
      this.state.isPlaying ||
      (this.state.isSeeking && this.state.shouldPlayAtEndOfSeek);

    // Example HLS url: https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8
    const overlayTextStyle = {
      color: colors.complementary,
      fontFamily: 'roboto-light',
      fontSize: fontSize(0),
    };

    const Control = ({ callback, children, ...otherProps }) =>
      <TouchableHighlight
        {...otherProps}
        underlayColor="transparent"
        hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
        activeOpacity={0.3}
        onPress={() => {
          this._resetControlsTimer();
          callback();
        }}>
        {children}
      </TouchableHighlight>;

    return (
      <TouchableWithoutFeedback onPress={() => this._toggleControls()}>
        <View
          style={{
            marginBottom: 20,
            backgroundColor: 'black',
          }}>
          <Video
            source={{
              uri: this.props.sources['240p'],
            }}
            ref={component => (this._playbackObject = component)}
            resizeMode={Video.RESIZE_MODE_CONTAIN}
            callback={this._playbackCallback}
            style={{
              width: videoWidth,
              height: videoHeight,
            }}
            shouldPlay={config.autoplayVideo}
          />

          {showSpinner &&
            <View
              style={{
                position: 'absolute',
                left: (videoWidth - centerIconWidth) / 2,
                top: (videoHeight - centerIconWidth) / 2,
              }}>
              {this.props.spinner}
            </View>}

          {!showSpinner &&
            !hidePlayPauseButton &&
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
              <Control callback={() => this._togglePlay()}>
                {showPauseButton ? this.props.pauseIcon : this.props.playIcon}
              </Control>
            </Animated.View>}

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
              <Slider
                style={{ flex: 2, marginRight: 10, marginLeft: 10 }}
                trackImage={this.props.trackImage}
                thumbImage={this.props.thumbImage}
                value={this._getSeekSliderPosition()}
                onValueChange={this._onSeekSliderValueChange}
                onSlidingComplete={this._onSeekSliderSlidingComplete}
                disabled={this.state.isLoading}
              />
              <Text style={[overlayTextStyle, { marginRight: 5 }]}>
                {this._getMMSSFromMillis(this.state.playbackInstanceDuration)}
              </Text>
              <Control
                callback={() => {
                  this.props.isPortrait
                    ? this.props.onFullscreen()
                    : this.props.onUnFullscreen();
                }}>
                {this.state.fullscreen
                  ? this.props.fullscreenExitIcon
                  : this.props.fullscreenEnterIcon}
              </Control>
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
