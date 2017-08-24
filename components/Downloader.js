import React from 'react';
import { Text, View, TouchableHighlight, NetInfo } from 'react-native';
import * as Progress from 'react-native-progress';
import prettyMs from 'pretty-ms';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../styles/colors';

import { RegularText } from './Texts';

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

    // this.savedUrl = FileSystem.documentDirectory + 'test.mp4';
    // Expo.FileSystem
    //   .downloadAsync(
    //     'http://techslides.com/demos/sample-videos/small.mp4',
    //     this.savedUrl
    //   )
    //   .then(({ uri }) => {
    //     console.log('Finished downloading', uri, this.savedUrl);
    //     this.setState({ localVideoUri: uri });
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });

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
    const Status = ({ iconName, text }) =>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        <MaterialIcons
          style={{ marginRight: 5 }}
          name={iconName}
          size={28}
          color={colors.tertiary}
        />
        <RegularText style={{ color: colors.tertiary }}>
          {text}
        </RegularText>
      </View>;

    return (
      <View
        style={{
          marginLeft: 30,
          marginRight: 30,
          paddingTop: 10,
          paddingBottom: 10,
        }}>
        {this.state.state === STATES.NOTSTARTED &&
          <View>
            <TouchableHighlight onPress={this.saveToDisk.bind(this)}>
              <View>
                <Status
                  iconName={'play-for-work'}
                  text={'Download for offline viewing'}
                />
              </View>
            </TouchableHighlight>
          </View>}
        {this.state.state === STATES.DOWNLOADING &&
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <View style={{ marginRight: 5 }}>
              {/* <Progress.Circle size={30} progress={this.state.progress} /> */}
              <Progress.Pie
                size={30}
                progress={this.state.progress}
                color={colors.tertiary}
              />
            </View>
            <View>
              <RegularText style={{ color: colors.tertiary }}>
                Downloading for offline viewing...
              </RegularText>
              <RegularText style={{ color: colors.tertiary }}>
                {this.state.timeRemaining} remaining
              </RegularText>
            </View>
          </View>}
        {this.state.state === STATES.DOWNLOADED &&
          <Status
            iconName={'offline-pin'}
            text={'Lecture available for offline viewing'}
          />}
      </View>
    );
  }
}

reactMixin(Downloader.prototype, TimerMixin);

export default Downloader;
