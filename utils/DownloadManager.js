import { AppState } from 'react-native';
import { FileSystem } from 'expo';
import _ from 'lodash';

export const STATES = {
  NOTSTARTED: 'NOTSTARTED',
  START_DOWNLOAD: 'START_DOWNLOAD',
  DOWNLOADING: 'DOWNLOADING',
  STALLED: 'STALLED',
  DOWNLOADED: 'DOWNLOADED',
  ERROR: 'ERROR',
};

export default class DownloadManager {
  STATES = {
    NOTSTARTED: 'NOTSTARTED',
    START_DOWNLOAD: 'START_DOWNLOAD',
    DOWNLOADING: 'DOWNLOADING',
    STALLED: 'STALLED',
    DOWNLOADED: 'DOWNLOADED',
    ERROR: 'ERROR',
  };

  constructor(store) {
    this._store = store;
    this._data = store.getState().courseData;
    this._firstRun = true;
    this._downloads = {};
    this._previousAppState = 'active';

    this._store.subscribe(() => {
      this._startNewDownloads();
    });

    this._restartInterruptedDownloads();
    this._resumeAllDownloads();

    AppState.addEventListener('change', this._handleAppStateChange);
  }

  teardown() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  // NetInfo.fetch().then(reach => {
  //   // console.log('Initial: ' + reach);
  // });
  // NetInfo.addEventListener('change', reach => {
  //   // console.log('Change: ' + reach);
  //   // TODO: Change to STATES.STALLED
  // });

  _handleAppStateChange = nextAppState => {
    console.log('[app state]', nextAppState);
    if (nextAppState === 'active' && this._previousAppState !== 'active') {
      this._resumeAllDownloads();
    } else if (
      nextAppState !== 'active' &&
      this._previousAppState === 'active'
    ) {
      this._stopAllDownloads();
    }
    this._previousAppState = nextAppState;
  };

  _restartInterruptedDownloads() {
    let offlineState = this._store.getState().offline;
    for (let id of Object.keys(offlineState)) {
      let { state } = offlineState[id];
      if (state === STATES.DOWNLOADING) {
        this._startDownload(id);
      }
    }
  }

  _startNewDownloads() {
    let offlineState = this._store.getState().offline;
    for (let id of Object.keys(offlineState)) {
      let { state } = offlineState[id];
      if (state === STATES.START_DOWNLOAD && !this._downloads[id]) {
        this._startDownload(id);
      }
    }
  }

  _getDataWithId(id) {
    for (let week of this._data) {
      if (week.weekNumber.toString() == id.toString()) {
        return week;
      }
    }
  }

  _createDownloadProgressHandler(id) {
    return ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
      const speedBytesPerMs = 1;
      const timeRemainingMs =
        (totalBytesExpectedToWrite - totalBytesWritten) / speedBytesPerMs;
      //   console.log('status ', id, totalBytesWritten, totalBytesExpectedToWrite);
      this._store.dispatch({
        type: 'OFFLINE',
        id: id,
        status: {
          totalBytes: totalBytesExpectedToWrite,
          currentBytes: totalBytesWritten,
          state: STATES.DOWNLOADING,
        },
      });
    };
  }

  async _startDownload(id) {
    const data = this._getDataWithId(id);
    const videoUri = data.videos['240p'];
    const fileUri = FileSystem.documentDirectory + id + '.mp4';
    // TODO: Catch errors
    const { exists } = await FileSystem.getInfoAsync(fileUri);
    if (exists) {
      await FileSystem.deleteAsync(fileUri);
    }

    const downloadResumable = FileSystem.createDownloadResumable(
      videoUri,
      fileUri,
      {},
      this._createDownloadProgressHandler(id)
    );

    this._startDownloadFromResumable(downloadResumable, id);
  }

  async _startDownloadFromResumable(downloadResumable, id, resume = false) {
    this._downloads[id] = downloadResumable;
    try {
      if (resume) {
        const url = await downloadResumable.resumeAsync();
        if (!url) {
          return;
        }
      } else {
        const url = await downloadResumable.downloadAsync();
        if (!url) {
          return;
        }
      }
      this._store.dispatch({
        type: 'OFFLINE',
        id,
        status: {
          state: STATES.DOWNLOADED,
        },
      });
      // Remove from downloads
      delete this._downloads[id];
    } catch (e) {
      console.log(e);
    }
  }

  async _stopAllDownloads() {
    for (let id of Object.keys(this._downloads)) {
      let downloadResumable = this._downloads[id];
      await downloadResumable.pauseAsync();
      const savable = JSON.stringify(downloadResumable.savable());
      this._store.dispatch({
        type: 'OFFLINE',
        id,
        status: {
          state: STATES.STALLED,
          savable,
        },
      });
    }
    this._downloads = {};
  }

  async _resumeAllDownloads() {
    // TODO: Catch errors

    let offlineState = this._store.getState().offline;
    for (let id of Object.keys(offlineState)) {
      let { state, savable } = offlineState[id];
      if (state === STATES.STALLED && savable) {
        const downloadFromStore = JSON.parse(savable);
        if (downloadFromStore !== null) {
          downloadResumable = new FileSystem.DownloadResumable(
            downloadFromStore.url,
            downloadFromStore.fileUri,
            downloadFromStore.options,
            this._createDownloadProgressHandler(id),
            downloadFromStore.resumeData
          );
          this._startDownloadFromResumable(downloadResumable, id, true);
        }
      }
    }
  }
}
