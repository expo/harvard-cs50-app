import { AppState, NetInfo } from 'react-native';
import { FileSystem } from 'expo';
import _ from 'lodash';
import Sentry from 'sentry-expo';

const DOWNLOADING = ({ totalBytes, currentBytes, savable }) => ({
  currentBytes,
  totalBytes,
  savable,
  state: 'DOWNLOADING',
});

const DOWNLOADED = ({ uri }) => ({
  uri,
  state: 'DOWNLOADED',
});

const ERROR = ({ message }) => ({
  message,
  state: 'ERROR',
});

export const STATES = {
  NOTSTARTED: 'NOTSTARTED',
  START_DOWNLOAD: 'START_DOWNLOAD',
  DOWNLOADING: 'DOWNLOADING',
  DOWNLOADED: 'DOWNLOADED',
  ERROR: 'ERROR',
};

export default class DownloadManager {
  constructor(store) {
    this._store = store;
    this._downloadResumables = {};
    this._previousAppState = AppState.currentState;
    console.log('previous state', this._previousAppState);

    // Subscribe to the store to scan for `START_DOWNLOAD` state changes, which is how the Downloader component
    // informs us that the user wants to download the file
    this._store.subscribe(this._startNewDownloads.bind(this));

    // Run through OFFLINE states and start/resume downloading
    this._onAppStart();

    AppState.addEventListener('change', this._handleAppStateChange);
    NetInfo.addEventListener('change', this._handleNetworkStateChange);

    // TODO: Periodally pause all downloads and resume them
  }

  teardown() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    NetInfo.removeEventListener('change', this._handleNetworkStateChange);
  }

  _onAppStart() {
    // Reset ERROR'ed out Downloads
    _(this._store.getState().offline).forEach(async ({ state }, id) => {
      if (state === STATES.ERROR) {
        this._updateStore(
          id,
          DOWNLOADING({
            totalBytes: 1,
            currentBytes: 0,
          })
        );
      }
    });

    this._startNewDownloads();
    this._resumeAllDownloads();
  }

  _handleAppStateChange = nextAppState => {
    console.log('[app state]', nextAppState);
    if (nextAppState === 'active' && this._previousAppState !== 'active') {
      this._resumeAllDownloads();
      this._previousAppState = nextAppState;
    } else if (
      nextAppState !== 'active' &&
      this._previousAppState === 'active'
    ) {
      this._pauseAllDownloads();
      this._previousAppState = nextAppState;
    }
  };

  _handleNetworkStateChange = networkState => {
    console.log('[network state]', networkState);
  };

  // Store functions

  _getDataWithId(id) {
    let data = null;
    _.forOwn(this._store.getState().courseData, yearData => {
      for (let week of yearData) {
        if (week.id.toString() == id.toString()) {
          data = week;
          return;
        }
      }
    });
    // TODO: If the id is not found anymore, delete that key in the store
    return data;
  }

  _updateStore(id, state) {
    // Logging
    const previousState = this._store.getState().offline[id];
    const nextState = state;
    previousState.state !== nextState.state &&
      console.log(id, previousState.state, ' -> ', nextState.state);
    if (
      previousState.state === STATES.DOWNLOADING &&
      nextState.state === STATES.DOWNLOADING
    ) {
      const previousSavable = previousState.savable;
      const nextSavable = nextState.savable;
      if (!previousSavable && nextSavable) {
        console.log(id, previousState.state, ' ->  SAVED');
      }
      if (previousSavable && !nextSavable) {
        console.log(id, 'SAVED ->  ', nextState.state);
      }
    }
    // Update OFFLINE state associated with id
    this._store.dispatch({
      type: 'OFFLINE',
      id,
      state,
    });
  }

  _createDownloadProgressHandler(id) {
    return ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
      let previousState = this._store.getState().offline[id].state;
      if (
        previousState === STATES.DOWNLOADING ||
        previousState === STATES.START_DOWNLOAD
      ) {
        // DOWNLOADING can only transition from START_DOWNLOAD/DOWNLOADING
        this._updateStore(
          id,
          DOWNLOADING({
            totalBytes: totalBytesExpectedToWrite,
            currentBytes: totalBytesWritten,
          })
        );
      }
    };
  }

  async _startDownloadForId(id) {
    const data = this._getDataWithId(id);
    const videoUri = data.videos['240p'];
    const fileUri = FileSystem.documentDirectory + id + '.mp4';

    // TODO: Catch errors
    try {
      const { exists } = await FileSystem.getInfoAsync(fileUri);
      if (exists) {
        await FileSystem.deleteAsync(fileUri);
      }
    } catch (e) {
      console.log('File overwrite error', e);
      Sentry.captureException(e);
      Sentry.captureMessage('File overwrite error');
      this._updateStore(id, ERROR({ message: 'Error downloading file' }));
      return;
    }

    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        videoUri,
        fileUri,
        {},
        _.throttle(this._createDownloadProgressHandler(id), 200)
      );
      this._downloadResumables[id] = downloadResumable;
      const uri = await downloadResumable.downloadAsync();
      if (uri) {
        this._updateStore(id, DOWNLOADED({ uri }));
      }
    } catch (e) {
      console.log('File download error', e);
      Sentry.captureMessage('File download error');
      Sentry.captureException(e);
      this._updateStore(id, ERROR({ message: 'Error downloading file' }));
    } finally {
      delete this._downloadResumables[id];
    }
  }

  async _startDownloadFromStore(id, savable) {
    const downloadFromStore = JSON.parse(savable);
    if (downloadFromStore !== null) {
      try {
        const downloadResumable = new FileSystem.DownloadResumable(
          downloadFromStore.url,
          downloadFromStore.fileUri,
          downloadFromStore.options,
          this._createDownloadProgressHandler(id),
          downloadFromStore.resumeData
        );
        this._downloadResumables[id] = downloadResumable;
        const uri = await downloadResumable.resumeAsync();
        if (uri) {
          this._updateStore(id, DOWNLOADED({ uri }));
        }
      } catch (e) {
        console.log('File download error', e);
        Sentry.captureMessage('File download error');
        Sentry.captureException(e);
        this._updateStore(id, ERROR({ message: 'Error downloading file' }));
      } finally {
        delete this._downloadResumables[id];
      }
    }
  }

  async _startNewDownloads() {
    _(this._store.getState().offline).forEach(async ({ state }, id) => {
      if (state === STATES.START_DOWNLOAD && !this._downloadResumables[id]) {
        this._updateStore(
          id,
          DOWNLOADING({
            totalBytes: 1,
            currentBytes: 0,
          })
        );
        this._startDownloadForId(id);
      }
    });
  }

  async _pauseAllDownloads() {
    _(this._downloadResumables).forEach(async (downloadResumable, id) => {
      try {
        await downloadResumable.pauseAsync();
        const savable = JSON.stringify(downloadResumable.savable());
        this._updateStore(id, DOWNLOADING({ savable }));
      } catch (e) {
        console.log(e);
        Sentry.captureException(e);
      }
    });
    // All downloadResumables have been paused (TODO: what if some are not successful?)
    this._downloadResumables = {};
  }

  async _resumeAllDownloads() {
    // TODO: Catch errors
    _(
      this._store.getState().offline
    ).forEach(async ({ state, savable }, id) => {
      if (state === STATES.DOWNLOADING) {
        if (savable) {
          this._startDownloadFromStore(id, savable);
        } else {
          this._startDownloadForId(id);
        }
      }
    });
  }
}
