import React from 'react';
import {
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
  Platform,
} from 'react-native';
import styles, { colors, fontSize } from '../styles/style';
import { EvilIcons } from '@expo/vector-icons';

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pressed: false };
  }

  render() {
    if (Platform.OS === 'ios') {
      return (
        <TouchableHighlight
          onPress={this.props.onPress}
          underlayColor={colors.primary}
          onPressIn={() => {
            this.setState({ pressed: true });
          }}
          onPressOut={() => {
            this.setState({ pressed: false });
          }}
          style={{
            justifyContent: 'center',
            paddingTop: 20,
            paddingBottom: 20,
            marginLeft: styles.mainViewStyle.marginLeft,
            borderBottomWidth: 1,
            borderBottomColor: colors.primary,
          }}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontFamily: 'roboto-light',
                fontSize: fontSize(1),
                color: this.state.pressed
                  ? colors.complementary
                  : colors.secondary,
                alignSelf: 'flex-start',
              }}>
              {this.props.text}
            </Text>
            <EvilIcons
              name="chevron-right"
              size={32}
              color={
                this.state.pressed ? colors.complementary : colors.secondary
              }
            />
          </View>
        </TouchableHighlight>
      );
    } else {
      return (
        <View
          style={{
            justifyContent: 'center',
            paddingTop: 20,
            paddingBottom: 20,
            marginLeft: styles.mainViewStyle.marginLeft,
            borderBottomWidth: 1,
            borderBottomColor: colors.primary,
          }}>
          <TouchableNativeFeedback
            onPress={this.props.onPress}
            underlayColor={colors.primary}
            onPressIn={() => {
              this.setState({ pressed: true });
            }}
            onPressOut={() => {
              this.setState({ pressed: false });
            }}
            style={{
              justifyContent: 'center',
              paddingTop: 20,
              paddingBottom: 20,
              marginLeft: styles.mainViewStyle.marginLeft,
              borderBottomWidth: 1,
              borderBottomColor: colors.primary,
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontFamily: 'roboto-light',
                  fontSize: fontSize(1),
                  color: colors.secondary,
                  alignSelf: 'flex-start',
                }}>
                {this.props.text}
              </Text>
              <EvilIcons
                name="chevron-right"
                size={32}
                color={colors.secondary}
              />
            </View>
          </TouchableNativeFeedback>
        </View>
      );
    }
  }
}

export default Row;
