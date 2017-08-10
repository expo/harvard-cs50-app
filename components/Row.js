import React from 'react';
import { Text, View, TouchableWithoutFeedback } from 'react-native';
import styles, { colors, fontSize } from '../styles/style';
import { EvilIcons, FontAwesome } from '@expo/vector-icons';
import CrossTouchable from './CrossTouchable';

class Row extends React.Component {
  state = {
    pressed: false,
  };

  render() {
    // TODO: Figure out how this should look on Android
    return (
      <TouchableWithoutFeedback
        onPressIn={() => {
          this.setState({ pressed: true });
        }}
        onPressOut={() => {
          this.setState({ pressed: false });
        }}
        onPress={evt => {
          this.setState({ pressed: true });
          this.props.onPress(evt);
        }}>
        <View
          style={{
            backgroundColor: this.state.pressed
              ? colors.primary
              : colors.transparent,
          }}>
          <View
            style={{
              justifyContent: 'center',
              paddingTop: 20,
              paddingBottom: 10,
              marginLeft: styles.mainViewStyle.marginLeft,
              borderBottomWidth: 1,
              borderBottomColor: this.state.pressed
                ? colors.transparent
                : colors.grey,
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {this.props.icon &&
                  <FontAwesome
                    name={this.props.icon}
                    size={18}
                    color={
                      this.state.pressed
                        ? colors.complementary
                        : colors.secondary
                    }
                    style={{
                      marginLeft: 2,
                    }}
                  />}
                <Text
                  style={{
                    fontFamily: 'roboto-regular',
                    fontSize: fontSize(1),
                    color: this.state.pressed
                      ? colors.complementary
                      : colors.secondary,
                    alignSelf: 'flex-start',
                    marginLeft: this.props.icon ? 15 : 0,
                  }}>
                  {this.props.text}
                </Text>
              </View>
              <EvilIcons
                name="chevron-right"
                size={32}
                color={this.state.pressed ? colors.complementary : colors.grey}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default Row;
