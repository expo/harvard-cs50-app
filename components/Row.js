import React from 'react';
import { Text, TouchableHighlight } from 'react-native';
import styles, { colors, fontSize } from '../styles/style';

class Row extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pressed: false };
  }

  render() {
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
        <Text
          style={{
            fontFamily: 'roboto-light',
            fontSize: fontSize(1),
            color: this.state.pressed ? 'white' : colors.secondary,
            alignSelf: 'flex-start',
          }}>
          {this.props.text}
        </Text>
      </TouchableHighlight>
    );
  }
}

export default Row;
