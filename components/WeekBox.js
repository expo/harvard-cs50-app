import React from 'react';
import { Text, View, Image, TouchableHighlight } from 'react-native';
import styles from '../styles/style';
import colors from '../styles/colors';

class WeekBox extends React.Component {
  state = {
    active: false,
  };
  render() {
    const textStyle = {
      color: this.state.active ? colors.complementary : colors.primary,
      fontSize: styles.fontSize(2),
    };
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        style={{
          borderRadius: 5,
          borderWidth: 2,
          borderColor: colors.primary,
          //backgroundColor: colors.secondary,
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
