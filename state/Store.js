import { createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { REHYDRATE } from 'redux-persist/constants';
import { AsyncStorage } from 'react-native';

const CURRENT_REDUX_VERSION = 2;

const reducer = (state = 0, action) => {
  const { type, id } = action;

  if (type === REHYDRATE) {
    if (
      persistedStateIsInvalid(action.payload) ||
      CURRENT_REDUX_VERSION.toString() != action.payload.version.toString()
    ) {
      console.log(getInitialState());
      console.log(
        'Migrated from ',
        action.payload.version,
        ' -> ',
        CURRENT_REDUX_VERSION
      );
      return getInitialState();
    } else {
      console.log(action.payload);
      return action.payload;
    }
  } else {
    let entry = {};
    switch (type) {
      case 'OFFLINE':
        entry[id] = action.state;
        let newState = {
          ...state,
          offline: { ...state.offline, ...entry },
        };
        return newState;
      case 'PLAYBACK':
        entry[id] = action.time;
        return {
          ...state,
          playback: { ...state.playback, ...entry },
        };
      case 'SET_DATA':
        return {
          ...state,
          courseData: action.data,
        };
      default:
        return state;
    }
  }
};

const getInitialState = () => {
  return {
    offline: {},
    playback: {},
    courseData: {},
    version: CURRENT_REDUX_VERSION,
  };
};

function persistedStateIsInvalid(state) {
  return Object.keys(state).length === 0;
}

const Store = createStore(
  reducer,
  getInitialState(),
  autoRehydrate({ log: true })
);

Store.rehydrateAsync = () => {
  return new Promise(resolve => {
    persistStore(
      Store,
      { storage: AsyncStorage, debounce: 500, blacklist: ['courseData'] },
      () => {
        resolve();
      }
    );
    //.purge() use to delete the existing store
  });
};

export default Store;
