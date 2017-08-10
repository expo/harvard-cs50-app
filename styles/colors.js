import { Platform } from 'react-native';

const colors = {
  primary: '#6E001C', // crimson
  secondary: '#A41034',
  tertiary: '#FD9E71',
  complementary: Platform.OS === 'ios' ? '#FFFFFF' : '#A41034', // Android doesn't need duplicate feedback for Touchables
  grey: '#CCC',
  transparent: 'rgba(0,0,0,0)',
};

export default colors;
