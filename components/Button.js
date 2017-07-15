// Source: https://medium.com/differential/better-cross-platform-react-native-components-cb8aadeba472

import React, { Component } from 'react';

import {
  Text,
  View,
  Platform,
  TouchableHighlight,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';

import { create } from 'react-native-platform-stylesheet';

const IOS_BLUE = '#007AFF';
const MATERIAL_BLUE = '#2196F3';

const styles = create({
  button: {
    padding: 20,
    margin: 10,
    width: 200,
  },
  buttonRaised: {
    borderRadius: 2,
    ios: {
      backgroundColor: IOS_BLUE,
    },
    android: {
      backgroundColor: MATERIAL_BLUE,
      elevation: 3,
    },
  },
  buttonFlat: {},
  buttonLabel: {
    textAlign: 'center',
    android: {
      fontWeight: 'bold',
    },
  },
  buttonLabelRaised: {
    color: '#FFFFFF',
  },
  buttonLabelFlat: {
    ios: {
      color: IOS_BLUE,
    },
    android: {
      color: MATERIAL_BLUE,
    },
  },
});

const ButtonWrapper = ({ raised, onPress, children }) => {
  // All Android Buttons should have the ripple effect
  if (Platform.OS === 'android') {
    // Raised Android buttons need a white ripple
    if (raised) {
      return (
        <TouchableNativeFeedback
          onPress={onPress}
          background={TouchableNativeFeedback.Ripple('#FFF')}>
          <View style={[styles.button, styles.buttonRaised]}>
            {children}
          </View>
        </TouchableNativeFeedback>
      );
    }

    // Normal Android buttons get a gray ripple
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple()}>
        <View style={[styles.button, styles.buttonFLat]}>
          {children}
        </View>
      </TouchableNativeFeedback>
    );
  }

  // iOS raised buttons use TouchableHighlight
  if (raised) {
    return (
      <TouchableHighlight
        style={[styles.button, styles.buttonRaised]}
        underlayColor="#0052AC"
        onPress={onPress}>
        {children}
      </TouchableHighlight>
    );
  }

  // Normal iOS buttons use TouchableOpacity
  return (
    <TouchableOpacity
      style={[styles.button, styles.buttonFlat]}
      onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

class Button extends Component {
  renderLabel() {
    const labelStyles = [styles.buttonLabel];
    if (this.props.raised) {
      labelStyles.push(styles.buttonLabelRaised);
    } else {
      labelStyles.push(styles.buttonLabelFlat);
    }

    let labelText = this.props.label;
    if (Platform.OS === 'android') {
      labelText = labelText.toUpperCase();
    }

    return (
      <Text style={labelStyles}>
        {labelText}
      </Text>
    );
  }

  render() {
    return (
      <ButtonWrapper {...this.props}>
        {this.renderLabel()}
      </ButtonWrapper>
    );
  }
}

export default Button;
