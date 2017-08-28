import { StackNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import WeekScreen from '../screens/WeekScreen';
import LinkScreen from '../screens/LinkScreen';
import ResourcesScreen from '../screens/ResourcesScreen';

const LecturesNavigator = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Week: {
      screen: WeekScreen,
    },
    Link: {
      screen: LinkScreen,
    },
  },
  { mode: 'card' }
);

const ResourceNavigator = StackNavigator({
  Resources: {
    screen: ResourcesScreen,
  },
  Link: {
    screen: LinkScreen,
  },
});

export default (AppNavigator = StackNavigator(
  {
    Home: {
      screen: LecturesNavigator,
    },
    Resources: {
      screen: ResourceNavigator,
    },
  },
  { mode: 'modal', headerMode: 'none' }
));
