import { StackNavigator } from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import WeekScreen from './screens/WeekScreen';
import LinkScreen from './screens/LinkScreen';

export default StackNavigator({
  Home: {
    screen: HomeScreen,
    headerTintColor: 'red',
  },
  Week: {
    screen: WeekScreen,
  },
  Link: {
    screen: LinkScreen,
    headerMode: 'float',
  },
});
