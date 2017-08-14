import React from 'react';
import { Audio, Video } from 'expo';
import {
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Text,
  Slider,
} from 'react-native';
import PropTypes from 'prop-types';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

// Default assets

import {
  PlayIcon,
  PauseIcon,
  Spinner,
  FullscreenEnterIcon,
  FullscreenExitIcon,
  ReplayIcon,
} from './assets/icons';
const TRACK_IMAGE = require('./assets/track.png');
const THUMB_IMAGE = require('./assets/thumb.png');

// UI states

var CONTROL_STATES = {
  SHOWN: 'SHOWN',
  SHOWING: 'SHOWING',
  HIDDEN: 'HIDDEN',
  HIDING: 'HIDDING',
};

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

// Don't show the Spinner for very short periods of buffering
const BUFFERING_SHOW_DELAY = 200;

const DEBUG = true;

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

    /**
     * Style to use for the all the text in the videoplayer including seek bar times and error messages
     */
    textStyle: PropTypes.object,

    /**
     * Props to use into the underlying <Video>. Useful for configuring autoplay, playback speed, and other Video properties.
     * See Expo documentation on <Video>.
     */
    videoProps: PropTypes.object,
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
    textStyle: {
      color: '#FFFFFF',
      fontFamily: 'roboto-regular',
      fontSize: 12,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      // Playback state
      playbackState: PLAYBACK_STATES.LOADING,
      lastPlaybackStateUpdate: Date.now(),

      //Seeking state
      seekState: SEEK_STATES.NOT_SEEKING,

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
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      });
    } catch (e) {
      this.props.errorCallback({
        type: 'NON_FATAL',
        message: 'setAudioModeAsync error',
        obj: e,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this._playbackInstance !== null &&
      nextProps.playFromPositionMillis !== this.props.playFromPositionMillis
    ) {
      // TODO: Ignore errors here?
      this._playbackInstance
        .playFromPositionAsync(nextProps.playFromPositionMillis)
        .catch(e => {
          this.props.errorCallback({
            type: 'NON_FATAL',
            message: 'playFromPositionMillis error',
            obj: e,
          });
        });
    }
  }

  // Handle events during playback
  _setPlaybackState(playbackState) {
    if (this.state.playbackState != playbackState) {
      DEBUG &&
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
  }

  _setSeekState(seekState) {
    DEBUG &&
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

    this.setState({ seekState });

    // Don't keep the controls timer running when the state is seeking
    if (seekState === SEEK_STATES.SEEKING) {
      this.controlsTimer && this.clearTimeout(this.controlsTimer);
    } else {
      // Start the controls timer anew
      this._resetControlsTimer();
    }
  }

  _playbackCallback(playbackStatus) {
    try {
      this.props.playbackCallback &&
        this.props.playbackCallback(playbackStatus);
    } catch (e) {
      console.error('Uncaught error when calling props.playbackCallback', e);
    }

    if (!playbackStatus.isLoaded) {
      if (playbackStatus.error) {
        this._setPlaybackState(PLAYBACK_STATES.ERROR);
        const errorMsg = `Encountered a fatal error during playback: ${playbackStatus.error}`;
        this.setState({
          error: errorMsg,
        });
        this.props.errorCallback({ type: 'FATAL', message: errorMsg, obj: {} });
      }
    } else {
      let newPlaybackState = this.state.playbackState;

      // Figure out what state should be next
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
      this._setPlaybackState(newPlaybackState);

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
      // A seek might have finished (SEEKED) but since we are not in NOT_SEEKING yet, the `shouldPlay` flag
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
      // Seeking is done, so go to SEEKED, and set playbackState to BUFFERING
      this._setSeekState(SEEK_STATES.SEEKED);
      this._setPlaybackState(PLAYBACK_STATES.BUFFERING);
      this._playbackInstance
        .setStatusAsync({
          positionMillis: value * this.state.playbackInstanceDuration,
          shouldPlay: this.shouldPlayAtEndOfSeek,
        })
        .then(playbackStatus => {
          // The underlying <Video> has successfully updated playback position
          this._setSeekState(SEEK_STATES.NOT_SEEKING);
          let newPlaybackState = PLAYBACK_STATES.BUFFERING;
          // TODO: Differentiate between playing, buffering and paused
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
          DEBUG && console.log('Seek error: ', message);
        });
    }
  };

  _onSeekBarTap = evt => {
    const value = evt.nativeEvent.locationX / this.state.sliderWidth;
    this._onSeekSliderValueChange();
    this._onSeekSliderSlidingComplete(value);
  };

  // Capture the width of the seekbar slider for use in `_onSeekbarTap`
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
        // Update playbackState to get out of ENDED state
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
    const centeredContentWidth = 60;

    const PlayIcon = this.props.playIcon;
    const PauseIcon = this.props.pauseIcon;
    const Spinner = this.props.spinner;
    const FullscreenEnterIcon = this.props.fullscreenEnterIcon;
    const FullscreenExitIcon = this.props.fullscreenExitIcon;
    const ReplayIcon = this.props.replayIcon;

    const {
      ref,
      callback,
      style,
      source,
      ...otherVideoProps
    } = this.props.videoProps;

    // TODO: Best way to throw errors
    if (!source) {
      console.error('Source is a required property');
    }

    const Control = ({ callback, center, style, children, ...otherProps }) =>
      <TouchableOpacity
        {...otherProps}
        hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
        onPress={() => {
          this._resetControlsTimer();
          callback();
        }}
        style={[
          {
            flex: center ? 1 : -1,
          },
          style,
        ]}>
        <View
          style={
            center
              ? {
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  justifyContent: 'center',
                  borderRadius: centeredContentWidth,
                  flex: 1,
                }
              : {}
          }>
          {children}
        </View>
      </TouchableOpacity>;

    const CenteredView = ({ children, style, ...otherProps }) =>
      <Animated.View
        {...otherProps}
        style={[
          {
            position: 'absolute',
            left: (videoWidth - centeredContentWidth) / 2,
            top: (videoHeight - centeredContentWidth) / 2,
            width: centeredContentWidth,
            height: centeredContentWidth,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          },
          style,
        ]}>
        {children}
      </Animated.View>;

    const ErrorText = ({ text }) =>
      <View
        style={{
          position: 'absolute',
          top: videoHeight / 2,
          width: videoWidth - 40,
          marginRight: 20,
          marginLeft: 20,
        }}>
        <Text style={[this.props.textStyle, { textAlign: 'center' }]}>
          {text}
        </Text>
      </View>;

    return (
      <TouchableWithoutFeedback onPress={this._toggleControls.bind(this)}>
        <View
          style={{
            backgroundColor: 'black',
          }}>
          <Video
            source={source}
            ref={component => (this._playbackInstance = component)}
            callback={this._playbackCallback.bind(this)}
            style={{
              width: videoWidth,
              height: videoHeight,
            }}
            {...otherVideoProps}
          />

          {/* Spinner */}
          {((this.state.playbackState == PLAYBACK_STATES.BUFFERING &&
            Date.now() - this.state.lastPlaybackStateUpdate >
              BUFFERING_SHOW_DELAY) ||
            this.state.playbackState == PLAYBACK_STATES.LOADING) &&
            <CenteredView>
              <Spinner />
            </CenteredView>}

          {/* Play/pause buttons */}
          {this.state.seekState == SEEK_STATES.NOT_SEEKING &&
            (this.state.playbackState == PLAYBACK_STATES.PLAYING ||
              this.state.playbackState == PLAYBACK_STATES.PAUSED) &&
            <CenteredView
              pointerEvents={
                this.state.controlsState === CONTROL_STATES.HIDDEN
                  ? 'none'
                  : 'auto'
              }
              style={{
                opacity: this.state.controlsOpacity,
              }}>
              <Control center={true} callback={this._togglePlay.bind(this)}>
                {this.state.playbackState == PLAYBACK_STATES.PLAYING
                  ? <PauseIcon />
                  : <PlayIcon />}
              </Control>
            </CenteredView>}

          {/* Replay button to show at the end of a video */}
          {this.state.playbackState == PLAYBACK_STATES.ENDED &&
            <CenteredView>
              <Control center={true} callback={this._replay.bind(this)}>
                <ReplayIcon />
              </Control>
            </CenteredView>}

          {/* Error display */}
          {this.state.playbackState == PLAYBACK_STATES.ERROR &&
            <ErrorText text={this.state.error} />}

          {/* Bottom bar */}
          <Animated.View
            pointerEvents={
              this.state.controlsState === CONTROL_STATES.HIDDEN
                ? 'none'
                : 'auto'
            }
            style={{
              position: 'absolute',
              bottom: 0,
              width: videoWidth,
              opacity: this.state.controlsOpacity,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {/* Current time display */}
            <Text style={[this.props.textStyle, { marginLeft: 5 }]}>
              {this._getMMSSFromMillis(this.state.playbackInstancePosition)}
            </Text>

            {/* Seek bar */}
            <TouchableWithoutFeedback
              onLayout={this._onSliderLayout.bind(this)}
              onPress={this._onSeekBarTap.bind(this)}>
              <Slider
                style={{ marginRight: 10, marginLeft: 10, flex: 1 }}
                trackImage={this.props.trackImage}
                thumbImage={this.props.thumbImage}
                value={this._getSeekSliderPosition()}
                onValueChange={this._onSeekSliderValueChange}
                onSlidingComplete={this._onSeekSliderSlidingComplete}
                disabled={
                  this.state.playbackState === PLAYBACK_STATES.LOADING ||
                  this.state.playbackState === PLAYBACK_STATES.ENDED ||
                  this.state.playbackState === PLAYBACK_STATES.ERROR
                }
              />
            </TouchableWithoutFeedback>

            {/* Duration display */}
            <Text style={[this.props.textStyle, { marginRight: 5 }]}>
              {this._getMMSSFromMillis(this.state.playbackInstanceDuration)}
            </Text>

            {/* Fullscreen control */}
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
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

reactMixin(VideoPlayer.prototype, TimerMixin);
