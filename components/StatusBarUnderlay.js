import React from 'react';
import { Animated, View } from 'react-native';
import { Constants } from 'expo';

import Colors from '../constants/Colors';

export default class StatusBarUnderlay extends React.PureComponent {
  render() {
    const underlay = (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: Constants.statusBarHeight,
          backgroundColor: Colors.purple,
        }}
      />
    );

    if (this.props.animatedOpacity) {
      return (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            opacity: this.props.animatedOpacity,
          }}>
          {underlay}
        </Animated.View>
      );
    } else {
      return underlay;
    }
  }
}
