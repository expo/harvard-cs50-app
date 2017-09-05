import React from 'react';
import { Font, Asset, AppLoading } from 'expo';
import { Provider } from 'react-redux';
import _ from 'lodash';
import Sentry from 'sentry-expo';

import AppNavigator from './navigation/AppNavigator';
import OnboardScreen from './screens/OnboardScreen';
import Store from './state/Store';
import fonts from './styles/fonts';
import config from './utils/config';
import DownloadManager from './utils/DownloadManager';
import Data from './data/Data';

import {
  EvilIcons,
  FontAwesome,
  MaterialIcons,
  Ionicons,
  Foundation,
} from '@expo/vector-icons';

// Setup Sentry
Sentry.enableInExpoDevelopment = config.sentryEnabledInDev;
Sentry.config(config.SENTRY_PUBLIC_DSN).install();

class AppContainer extends React.Component {
  state = {
    appIsReady: false,
    firstLoad: config.firstLoad,
  };

  componentWillMount() {
    this._loadAssetsAsync();
  }

  componentWillUnmount() {
    this._downloadManager && this._downloadManager.teardown();
  }

  _cacheFonts(fonts) {
    return fonts.map(font => Font.loadAsync(font));
  }

  _cacheImages(images) {
    return images.map(image => {
      if (typeof image === 'string') {
        return Image.prefetch(image);
      } else {
        return Asset.fromModule(image).downloadAsync();
      }
    });
  }

  async _loadAssetsAsync() {
    const imageAssets = this._cacheImages([
      require('./assets/videoplayer/thumb.png'),
      require('./assets/videoplayer/track.png'),
    ]);
    const fontAssets = this._cacheFonts([
      fonts,
      EvilIcons.font,
      FontAwesome.font,
      Ionicons.font,
      MaterialIcons.font,
      Foundation.font,
    ]);

    try {
      await Promise.all([
        Store.rehydrateAsync(),
        ...imageAssets,
        ...fontAssets,
      ]);
      Store.dispatch({ type: 'SET_DATA', data: Data });
    } catch (e) {
      console.log('Error downloading assets', e);
      Sentry.captureException(e);
    }

    this._downloadManager = new DownloadManager(Store);
    this.setState({ appIsReady: true });
  }

  render() {
    if (!this.state.appIsReady) {
      return <AppLoading />;
    }

    return this.state.firstLoad
      ? <OnboardScreen startApp={() => this.setState({ firstLoad: false })} />
      : <Provider store={Store}>
          <AppNavigator />
        </Provider>;
  }
}

export default AppContainer;
