import { Platform } from 'react-native';
import colors from './colors';

// Use Modular Scale to create harmony between various font sizes that we use (See http://www.modularscale.com/)
const fontSize = n => {
  const baseFontSize = 16;
  // Major second
  const multiplier = 1.125;
  if (n > 0) {
    return baseFontSize * (multiplier * n);
  } else if (n === 0) {
    return baseFontSize;
  } else {
    return baseFontSize / (multiplier * Math.abs(n));
  }
};

// Header styles

const headerTintColor = colors.secondary;

const headerTitleStyle = {
  fontFamily: 'custom-black',
  fontSize: fontSize(1),
  letterSpacing: -0.4,
};

const headerStyle = {
  borderBottomWidth: 1,
  borderColor: colors.secondary,
  backgroundColor: 'white',
  height: Platform.OS === 'ios' ? 80 : 100,
};

// H1
const h1Style = {
  fontSize: fontSize(2),
  letterSpacing: -1,
  color: colors.primary,
  fontFamily: 'custom-black',
};

// Margins for all views

const mainViewStyle = {
  marginLeft: 30,
  marginRight: 20,
};

const layoutStyle = mainViewStyle;

// TODO: Something for vertical rhythm

const styles = {
  fontSize,
  headerTintColor,
  headerTitleStyle,
  headerStyle,
  mainViewStyle,
  h1Style,
};

export default styles;
