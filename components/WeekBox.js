import React from 'react';
import {
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
  Platform,
  Image,
} from 'react-native';
import styles, { colors, fontSize } from '../styles/style';
import { EvilIcons } from '@expo/vector-icons';

class WeekBox extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { pressed: false };
  }

  render() {
    const textStyle = { color: colors.primary, fontSize: fontSize(2) };
    if (Platform.OS === 'ios') {
      return (
        <TouchableHighlight onPress={this.props.onPress}>
          <View
            key={this.props.key}
            style={{
              paddingTop: 50,
              paddingBottom: 50,
              marginTop: 10,
              borderRadius: 5,
              borderWidth: 2,
              borderColor: colors.primary,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: this.props.imageWidth,
                alignItems: 'center',
              }}>
              <Image
                source={require('../assets/memory.png')}
                fadeDuration={0}
                style={{ width: 50, height: 60 }}
              />
              {/* <AnimatedIcon /> */}
            </View>
            <View
              style={{
                width: this.props.textWidth,
                alignItems: 'flex-start',
              }}>
              <Text style={textStyle} numberOfLines={1}>
                {this.props.title}
              </Text>
              <Text style={textStyle} numberOfLines={1}>
                {this.props.desc}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableNativeFeedback onPress={this.props.onPress}>
          <View
            key={this.props.key}
            style={{
              paddingTop: 50,
              paddingBottom: 50,
              marginTop: 10,
              borderRadius: 5,
              borderWidth: 2,
              borderColor: colors.primary,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: this.props.imageWidth,
                alignItems: 'center',
              }}>
              <Image
                source={require('../assets/memory.png')}
                fadeDuration={0}
                style={{ width: 50, height: 60 }}
              />
              {/* <AnimatedIcon /> */}
            </View>
            <View
              style={{
                width: this.props.textWidth,
                alignItems: 'flex-start',
              }}>
              <Text style={textStyle} numberOfLines={1}>
                {this.props.title}
              </Text>
              <Text style={textStyle} numberOfLines={1}>
                {this.props.desc}
              </Text>
            </View>
          </View>
        </TouchableNativeFeedback>
      );
    }
  }
}

export default WeekBox;
