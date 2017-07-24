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
} from 'react-native';
import StoredValue from '../utils/StoredValue';
import config from '../utils/config';
import { colors, fontSize } from '../styles/style';
import { Foundation, FontAwesome } from '@expo/vector-icons';

class Spinner extends React.Component {
  state = { rotate: new Animated.Value(0) };

  componentDidMount() {
    this.spinnerAnimation = Animated.timing(this.state.rotate, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    this.spinnerLoop = Animated.loop(this.spinnerAnimation);
    this.spinnerLoop.start();
  }

  render() {
    const spin = this.state.rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <FontAwesome name="spinner" size={48} color={colors.complementary} />
      </Animated.View>
    );
  }
}

export default class VideoPlayer extends React.Component {
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
      volume: 1.0,
      poster: false,
      fullscreen: false,
      isSeeking: false,
      controlsOpacity: new Animated.Value(0),
    };
  }

  async componentDidMount() {
    // Set audio mode to play even in silent mode (like the YouTube app)
    // TODO: Handle rejection of the returned promise
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS, // TODO(Abi): Switch back to INTERRUPTION_MODE_IOS_DO_NOT_MIX
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
          this._playbackObject.setStatusAsync({ isMuted: true }); // TODO: Convert to settings
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

  _togglePlay() {
    this.state.isPlaying
      ? this._playbackObject.pauseAsync()
      : this._playbackObject.playAsync();
  }

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
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this._playbackObject.pauseAsync();
    }
  };

  _onSeekSliderSlidingComplete = async value => {
    if (this._playbackObject != null) {
      this.setState({ isSeeking: false });
      const seekPosition = value * this.state.playbackInstanceDuration;
      if (this.shouldPlayAtEndOfSeek) {
        this._playbackObject.playFromPositionAsync(seekPosition);
      } else {
        this._playbackObject.setPositionAsync(seekPosition);
      }
    }
  };

  _showControls = () => {
    Animated.timing(this.state.controlsOpacity, {
      toValue: 1,
      duration: 200,
    }).start();

    if (this.controlsTimer) {
      clearTimeout(this.controlsTimer);
    }
    this.controlsTimer = setTimeout(this._hideControls.bind(this), 4000);
  };

  _hideControls = () => {
    if (this.controlsTimer) {
      clearTimeout(this.controlsTimer);
    }
    this.hideAnimation = Animated.timing(this.state.controlsOpacity, {
      toValue: 0,
      duration: 2000,
    });
    this.hideAnimation.start();
  };

  _resetControlsTimer = () => {
    if (this.controlsTimer) {
      clearTimeout(this.controlsTimer);
    }
    if (this.hideAnimation) {
      this.hideAnimation.stop();
    }
    this.setState({ controlsOpacity: new Animated.Value(1) });
    this.controlsTimer = setTimeout(this._hideControls.bind(this), 4000);
  };

  render() {
    var videoWidth = Dimensions.get('window').width;
    var videoHeight = videoWidth * (9 / 16);

    const showSpinner =
      this.state.isBuffering ||
      this.state.isLoading ||
      (this.state.shouldPlay && !this.state.isPlaying);

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
        hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
        activeOpacity={0.3}
        onPress={() => {
          this._resetControlsTimer();
          callback();
        }}>
        {children}
      </TouchableHighlight>;

    return (
      <TouchableWithoutFeedback onPress={() => this._showControls()}>
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
          <View
            style={{
              position: 'absolute',
              left: videoWidth / 2 - 24,
              top: videoHeight / 2 - 24,
              opacity: showSpinner ? 1 : 0,
            }}>
            <Spinner />
          </View>

          {!showSpinner &&
            <Animated.View
              style={{
                opacity: this.state.controlsOpacity,
                position: 'absolute',
                left: videoWidth / 2 - 24,
                top: videoHeight / 2 - 24,
              }}>
              <Control callback={() => this._togglePlay()}>
                <Foundation
                  name={this.state.isPlaying ? 'pause' : 'play'}
                  size={48}
                  color={colors.complementary}
                />
              </Control>
            </Animated.View>}
          <Animated.View
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
                trackImage={require('../assets/icons/track.png')}
                thumbImage={require('../assets/icons/thumb.png')}
                value={this._getSeekSliderPosition()}
                onValueChange={this._onSeekSliderValueChange}
                onSlidingComplete={this._onSeekSliderSlidingComplete}
                disabled={this.state.isLoading}
              />
              <Text style={[overlayTextStyle, { marginRight: 5 }]}>
                {this._getMMSSFromMillis(this.state.playbackInstanceDuration)}
              </Text>
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
