import { Platform } from 'react-native';
export const colors = {
  primary: '#6E001C',
  secondary: '#A41034',
  tertiary: '#FD9E71',
};

export const fontSize = n => {
  const baseFontSize = 12;
  const multiplier = 1.618;
  return baseFontSize * (multiplier * n);
};

export const fonts = {
  'roboto-light': require('../assets/fonts/Roboto-Light.ttf'),
  'roboto-bold': require('../assets/fonts/Roboto-Bold.ttf'),
  'roboto-black': require('../assets/fonts/Roboto-Black.ttf'),
};

export const headerStyle = {
  backgroundColor: '#bababa',
  paddingTop: 20,
  height: Platform.OS === 'ios' ? 80 : 100,
};

export const mainViewStyle = {
  marginLeft: 20,
  marginRight: 20,
};

// TODO: Add font families

// TODO: Something for vertical rhythm

// Setup default fontFamily for all <Text> to be Roboto-Light
