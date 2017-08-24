import React from 'react';
import { Text, View, TouchableWithoutFeedback } from 'react-native';
import { EvilIcons, FontAwesome } from '@expo/vector-icons';

import { RegularText } from './Texts';
import CrossTouchable from './CrossTouchable';
import styles from '../styles/style';
import colors from '../styles/colors';

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
          // Disable until we can figure out a way to reverse the coloring when the transition ends
          /* this.setState({ pressed: true }); */
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
                      textAlign: 'center',
                      width: 20,
                    }}
                  />}
                <RegularText
                  style={{
                    fontSize: styles.fontSize(1),
                    color: this.state.pressed
                      ? colors.complementary
                      : colors.secondary,
                    alignSelf: 'flex-start',
                    marginLeft: this.props.icon ? 15 : 0,
                  }}>
                  {this.props.text}
                </RegularText>
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
