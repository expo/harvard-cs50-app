import { StackNavigator } from 'react-navigation';
import WeekScreen from './screens/WeekScreen';
import LectureScreen from './screens/LectureScreen';

export default StackNavigator({
  Week: {
    screen: WeekScreen,
    headerTintColor: 'red',
  },
  Lecture: {
    screen: LectureScreen,
  },
});
