import { StackNavigator } from 'react-navigation';
import Expo, { AppLoading } from 'expo';
import React from 'react';

import HomeScreen from './screens/HomeScreen';
import WeekScreen from './screens/WeekScreen';
import LinkScreen from './screens/LinkScreen';

const AppNavigator = StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Week: {
    screen: WeekScreen,
  },
  Link: {
    screen: LinkScreen,
    headerMode: 'float',
  },
});

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
    const imageAssets = this._cacheImages([require('./assets/harvard.jpg')]);

    const fontAssets = this._cacheFonts([
      {
        'roboto-light': require('./assets/fonts/Roboto-Light.ttf'),
        'roboto-bold': require('./assets/fonts/Roboto-Bold.ttf'),
      },
    ]);

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
