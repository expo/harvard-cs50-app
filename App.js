import React from 'react';
import Expo, { AppLoading } from 'expo';
import { StackNavigator } from 'react-navigation';

import HomeScreen from './screens/HomeScreen';
import WeekScreen from './screens/WeekScreen';
import LinkScreen from './screens/LinkScreen';
import ResourcesScreen from './screens/ResourcesScreen';
import OnboardScreen from './screens/OnboardScreen';
import { fonts } from './styles/style.js';
import config from './utils/config';

import Sentry from 'sentry-expo';
Sentry.config(config.SENTRY_KEY).install();

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
});

const AppNavigator = StackNavigator(
  {
    Home: {
      screen: LecturesNavigator,
    },
    Resources: {
      screen: ResourceNavigator,
    },
  },
  { mode: 'modal', headerMode: 'none' }
);

class AppContainer extends React.Component {
  state = {
    appIsReady: false,
    firstLoad: config.firstLoad,
  };

  componentWillMount() {
    this._loadAssetsAsync();
  }

  _cacheFonts(fonts) {
    return fonts.map(font => Expo.Font.loadAsync(font));
  }

  _cacheImages(images) {
    return images.map(image => {
      if (typeof image === 'string') {
        return Image.prefetch(image);
      } else {
        return Expo.Asset.fromModule(image).downloadAsync();
      }
    });
  }

  async _loadAssetsAsync() {
    const imageAssets = this._cacheImages([require('./assets/memory.png')]);

    const fontAssets = this._cacheFonts([fonts]);

    // TODO: Catch errors here
    await Promise.all([...imageAssets, ...fontAssets]);

    this.setState({ appIsReady: true });
  }

  render() {
    if (!this.state.appIsReady) {
      return <AppLoading />;
    }

    return this.state.firstLoad
      ? <OnboardScreen startApp={() => this.setState({ firstLoad: false })} />
      : <AppNavigator />;
  }
}

export default AppContainer;
