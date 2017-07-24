import React from 'react';
import { Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

class Spinner extends React.Component {
  state = { rotate: new Animated.Value(0) };

  componentDidMount() {
    Animated.loop(
      Animated.timing(this.state.rotate, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }

  render() {
    const spin = this.state.rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.View
        style={[this.props.style, { transform: [{ rotate: spin }] }]}>
        <FontAwesome name="spinner" size={48} color={colors.complementary} />
      </Animated.View>
    );
  }
}

export default Spinner;
