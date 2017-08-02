import { Platform } from 'react-native';

// Colors

export const colors = {
  primary: '#6E001C', // crimson
  secondary: '#A41034',
  tertiary: '#FD9E71',
  complementary: Platform.OS === 'ios' ? '#FFFFFF' : '#A41034', // Android doesn't need duplicate feedback for Touchables
};

// Fonts

export const fontSize = n => {
  const baseFontSize = 12;
  const multiplier = Platform.OS === 'ios' ? 1.618 : 1.4;
  if (n > 0) {
    return baseFontSize * (multiplier * n);
  } else if (n === 0) {
    return baseFontSize;
  } else {
    return baseFontSize / (multiplier * Math.abs(n));
  }
};

export const fonts = {
  'roboto-light': require('../assets/fonts/Roboto-Light.ttf'),
  'roboto-bold': require('../assets/fonts/Roboto-Bold.ttf'),
  'roboto-black': require('../assets/fonts/Roboto-Black.ttf'),
};

// TODO: Add font families
// Setup default fontFamily for all <Text> to be Roboto-Light

// Header styles

export const headerTintColor = colors.tertiary;

export const headerStyle = {
  backgroundColor: colors.primary,
  height: Platform.OS === 'ios' ? 80 : 100,
};

// Margins for all views

export const mainViewStyle = {
  marginLeft: 20,
  marginRight: 20,
};

// TODO: Something for vertical rhythm

export default (styles = {
  colors,
  fontSize,
  fonts,
  headerTintColor,
  headerStyle,
  mainViewStyle,
});
