import React from 'react';
import {
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
  Platform,
  Image,
} from 'react-native';
import { colors, fontSize } from '../styles/style';
import CrossTouchable from './CrossTouchable';

class WeekBox extends React.Component {
  state = {
    active: false,
  };
  render() {
    const textStyle = {
      color: this.state.active ? colors.grey : colors.primary,
      fontSize: fontSize(2),
    };
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        style={{
          borderRadius: 2,
          borderWidth: 2,
          borderColor: colors.primary,
        }}
        onShowUnderlay={() => this.setState({ active: true })}
        onHideUnderlay={() => this.setState({ active: false })}
        underlayColor={colors.secondary}>
        <View
          style={{
            paddingTop: 50,
            paddingBottom: 50,
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
  }
}

export default WeekBox;
