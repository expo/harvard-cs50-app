import { Amplitude } from 'expo';
import config from './config';

const events = {
  USER_WATCHED_VIDEO: 'USER_WATCHED_VIDEO',
};

let isInitialized = false;

const maybeInitialize = () => {
  if (config.AMPLITUDE_API_KEY && !isInitialized) {
    Amplitude.initialize(config.AMPLITUDE_API_KEY);
    isInitialized = true;
  }
};

const track = (event, options = null) => {
  maybeInitialize();

  if (options) {
    Amplitude.logEventWithProperties(event, options);
  } else {
    Amplitude.logEvent(event);
  }
};

export default {
  events,
  track,
};
