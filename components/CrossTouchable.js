import {
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';

const CrossTouchable = Platform.select({
  ios: TouchableHighlight,
  android: TouchableNativeFeedback,
});

export default CrossTouchable;
