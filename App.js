import { StackNavigator } from 'react-navigation';
import { AppLoading } from 'expo';
import React from 'react';
import { AppRegistry } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import WeekScreen from './screens/WeekScreen';
import LinkScreen from './screens/LinkScreen';

const AppNavigator = StackNavigator({
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

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Expo.Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Expo.Font.loadAsync(font));
}

class AppContainer extends React.Component {
  state = {
    appIsReady: false,
  };

  componentWillMount() {
    this._loadAssetsAsync();
  }

  async _loadAssetsAsync() {
    const imageAssets = cacheImages([require('./assets/harvard.jpg')]);

    const fontAssets = cacheFonts([]);

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
