import { AsyncStorage } from 'react-native';

// This is a pretty empty abstraction but useful if we decide to change the underlying store later on
export default class StoredValue {
  constructor(key) {
    this._key = key;
  }

  async set(value) {
    // TODO: What's the return value here?
    const returnValue = await AsyncStorage.setItem(this._key, value);
    return returnValue;
  }

  // Returns a promise whose errors should be caught
  async get() {
    const value = await AsyncStorage.getItem(this._key);
    return value;
  }
}
