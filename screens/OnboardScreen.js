import React from 'react';
import {
  View,
  ListView,
  TouchableHighlight,
  Button as RNButton,
  Image,
  StyleSheet,
  StatusBar,
  Text,
} from 'react-native';
import Swiper from 'react-native-swiper';
import Expo from 'expo';
import { colors, fontSize } from '../styles/style';

// <StatusBar style what?

class OnboardScreen extends React.Component {
  render() {
    const Panel = ({ text, style }) =>
      <View
        style={[
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 30,
          },
          style,
        ]}>
        <Text
          style={{
            color: colors.primary,
            fontSize: fontSize(2),
            fontFamily: 'roboto-light',
            textAlign: 'center',
          }}>
          {text}
        </Text>
        <TouchableHighlight onPress={() => this.props.startApp()}>
          <Text>Go to app</Text>
        </TouchableHighlight>
      </View>;
    return (
      <Swiper loop={false} activeDotColor={colors.primary}>
        <Panel
          style={{ backgroundColor: colors.tertiary }}
          text="Watch lectures and access course materials"
        />
        <Panel
          style={{ backgroundColor: '#97CAE5' }}
          text="Download lecture videos for offline viewing"
        />
        <Panel
          style={{ backgroundColor: '#92BBD9' }}
          text="Get notifications when lectures are posted"
        />
      </Swiper>
    );
  }
}

export default OnboardScreen;
