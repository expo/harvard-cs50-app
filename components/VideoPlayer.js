import React from 'react';
import { Audio, Video } from 'expo';
import _ from 'lodash';
import { View, Dimensions, Button } from 'react-native';
import StoredValue from '../utils/StoredValue';
import config from '../utils/config';

export default class VideoPlayer extends React.Component {
  constructor() {
    super();
    this._togglePlay = this._togglePlay.bind(this);
    this._playbackCallback = this._playbackCallback.bind(this);
  }

  async componentDidMount() {
    // Set audio mode to play even in silent mode (like the YouTube app)
    // TODO: Handle rejection of the returned promise
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
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

  _playbackCallback(playbackStatus) {
    if (!playbackStatus.isLoaded) {
      // Update your UI for the unloaded state
      if (playbackStatus.error) {
        console.log(
          `Encountered a fatal error during playback: ${playbackStatus.error}`
        );
      }
    } else {
      var currentPos = playbackStatus.positionMillis.toString();
      //   console.log('Now playing ', currentPos);
      this.storedPlaybackTime
        .set(currentPos)
        .then(val => {
          //   console.log('Saved successfully to AsyncStorage', val);
        })
        .catch(error => {
          console.log('Error in saving stored value', error);
        });

      if (playbackStatus.isPlaying) {
        // Update your UI for the playing state
      } else {
        // Update your UI for the paused state
      }

      if (playbackStatus.isBuffering) {
        // Update your UI for the buffering state
        console.log('is buffering');
      }

      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        // The player has just finished playing and will stop. Maybe you want to play something else?
      }
    }
  }

  _togglePlay() {
    this._playbackObject.pauseAsync();
  }

  render() {
    var videoWidth = Dimensions.get('window').width;
    var videoHeight = videoWidth * (9 / 16);

    // Example HLS url: https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8

    return (
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
        {/*<View
          style={{
            position: 'absolute',
            top: 80,
            left: 80,
            backgroundColor: 'black',
            transform: [{ translate: [0, 0, 1] }],
          }}>
          <Button title="Play" color="white" onPress={this._togglePlay} />
        </View>*/}
      </View>
    );
  }
}
