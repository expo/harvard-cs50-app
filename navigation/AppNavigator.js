import { createStackNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import WeekScreen from '../screens/WeekScreen';
import LinkScreen from '../screens/LinkScreen';
import ResourcesScreen from '../screens/ResourcesScreen';

const LecturesNavigator = createStackNavigator(
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
  { mode: 'card', initialRouteParams: { year: 2017 } }
);

const ResourceNavigator = createStackNavigator({
  Resources: {
    screen: ResourcesScreen,
  },
  Link: {
    screen: LinkScreen,
  },
});

export default createStackNavigator(
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
);
