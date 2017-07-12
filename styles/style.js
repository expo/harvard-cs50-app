export const colors = {
  primary: '#A41034',
  secondary: '#EECFD6',
};

export const fontSize = n => {
  const baseFontSize = 12;
  const multiplier = 1.618;
  return baseFontSize * (multiplier * n);
};

// TODO: Add font families

// TODO: Something for vertical rhythm

// Setup default fontFamily for all <Text> to be Roboto-Light
