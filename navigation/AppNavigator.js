import { StackNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import WeekScreen from '../screens/WeekScreen';
import LinkScreen from '../screens/LinkScreen';
import ResourcesScreen from '../screens/ResourcesScreen';

const LecturesNavigator = StackNavigator(
  {
    Home: {
      screen: HomeScreen,
      initialRouteParams: { year: 2017 },
    },
    Week: {
      screen: WeekScreen,
    },
    Link: {
      screen: LinkScreen,
    },
  },
  { mode: 'card', initialRouteParams: { year: 2017 } }
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
      initialRouteParams: { year: 2017 },
    },
    Resources: {
      screen: ResourceNavigator,
    },
  },
  { mode: 'modal', headerMode: 'none', initialRouteParams: { year: 2017 } }
));
