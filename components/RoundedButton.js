import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors, Fonts } from '../constants';

export default class RoundedButton extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.style]}
        onPress={this.props.onPress}>
        <Text style={styles.text}>
          {this._getText()}
        </Text>
      </TouchableOpacity>
    );
  }

  _getText = () => {
    return this.props.text || this.props.children || '';
  };
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.snow,
    borderRadius: 100,
    paddingHorizontal: 25,
    paddingVertical: 12,
    backgroundColor: Colors.transparent,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontFamily: Fonts.type.bold,
    fontSize: 11,
    letterSpacing: 0,
    color: Colors.snow,
  },
});
