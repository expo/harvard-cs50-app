import { StackNavigator } from 'react-navigation';
import Expo, { AppLoading } from 'expo';
import React from 'react';

import HomeScreen from './screens/HomeScreen';
import WeekScreen from './screens/WeekScreen';
import LinkScreen from './screens/LinkScreen';
import ResourcesScreen from './screens/ResourcesScreen';
import { fonts } from './styles/style.js';

const MainNavigator = StackNavigator(
  {
    Main: {
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
  ResourcesInner: {
    screen: ResourcesScreen,
  },
});

const AppNavigator = StackNavigator(
  {
    Home: {
      screen: MainNavigator,
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

    await Promise.all([...imageAssets, ...fontAssets]);

    this.setState({ appIsReady: true });
  }

  render() {
    if (!this.state.appIsReady) {
      return <AppLoading />;
    }

    return <AppNavigator />;
  }
}

export default AppContainer;
