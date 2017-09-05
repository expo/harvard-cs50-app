import React from 'react';
import { Text, View, TouchableHighlight, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import prettyMs from 'pretty-ms';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import { connect } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';

import colors from '../styles/colors';
import { RegularText } from './Texts';
import { STATES } from '../utils/DownloadManager';

class Downloader extends React.Component {
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

    let progress = 0;
    if (
      this.props.downloadState.currentBytes &&
      this.props.downloadState.totalBytes
    ) {
      progress =
        this.props.downloadState.currentBytes /
        this.props.downloadState.totalBytes;
    }

    return (
      <View
        style={{
          paddingTop: 10,
          paddingBottom: 10,
        }}>
        {(!this.props.downloadState ||
          this.props.downloadState.state === STATES.NOTSTARTED) &&
          <View>
            <TouchableHighlight onPress={this.props.download}>
              <View>
                <Status
                  iconName={'play-for-work'}
                  text={'Download for offline viewing'}
                />
              </View>
            </TouchableHighlight>
          </View>}
        {(this.props.downloadState.state === STATES.DOWNLOADING ||
          this.props.downloadState.state === STATES.START_DOWNLOAD) &&
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <View style={{ marginRight: 5 }}>
              <Progress.Pie
                size={30}
                progress={progress}
                color={colors.tertiary}
              />
            </View>
            <View>
              <RegularText style={{ color: colors.tertiary }}>
                Downloading for offline viewing...
              </RegularText>
            </View>
          </View>}
        {this.props.downloadState.state === STATES.DOWNLOADED &&
          <Status
            iconName={'offline-pin'}
            text={'Lecture available for offline viewing'}
          />}
        {this.props.downloadState.state === STATES.ERROR &&
          <TouchableHighlight onPress={this.props.download}>
            <View>
              <Status
                iconName={'error'}
                text={
                  this.props.downloadState.message.toString() +
                  '. Tap to retry.'
                }
              />
            </View>
          </TouchableHighlight>}
      </View>
    );
  }
}

reactMixin(Downloader.prototype, TimerMixin);

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    download: () => {
      dispatch({
        type: 'OFFLINE',
        id: ownProps.id,
        state: { state: STATES.START_DOWNLOAD },
      });
    },
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    downloadState: state.offline[ownProps.id] || { state: STATES.NOTSTARTED },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Downloader);
