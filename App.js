import { StackNavigator } from 'react-navigation';
import WeekScreen from './screens/WeekScreen';
import LectureScreen from './screens/LectureScreen';
import WebScreen from './screens/WebScreen';

export default StackNavigator({
  Week: {
    screen: WeekScreen,
    headerTintColor: 'red',
  },
  Lecture: {
    screen: LectureScreen,
  },
  Web: {
    screen: WebScreen,
    headerMode: 'float'
  }
});
