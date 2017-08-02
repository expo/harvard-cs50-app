import {
  TouchableHighlight,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';

const CrossTouchable =
  Platform.OS === 'ios' ? TouchableHighlight : TouchableNativeFeedback;

export default CrossTouchable;
