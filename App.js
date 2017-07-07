import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';

import { StackNavigator } from 'react-navigation';

import WeekScreen from './screens/WeekScreen';
import LectureScreen from './screens/LectureScreen';

import NavigationBar from 'react-native-navbar';

import Expo from 'expo';

/*const rightButtonConfig = {
  title: 'Next',
  handler: () => alert('hello!'),
};*/

const titleConfig = {
  title: 'CS50 Week by Week',
  tintColor: 'white',
};

export default StackNavigator({
  Week: {
    screen: WeekScreen,
    headerTintColor: 'red',
  },
  Lecture: {
    screen: LectureScreen,
  },
});

const styles = StyleSheet.create({
  listViewView: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  weekButton: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: Dimensions.get('window').height / 6,
    width: Dimensions.get('window').width,
    paddingVertical: 15,
    paddingLeft: 20,
    backgroundColor: '#fff',
  },
  card: {
    height: Dimensions.get('window').height / 7,
    width: Dimensions.get('window').width - 40,
    alignItems: 'flex-start',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
  },
  weekText: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
  },
  weekTextArrow: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    textAlign: 'right',
  },
  weekContentText: {
    color: 'gray',
    textAlign: 'left',
  },
  weekImage: {
    height: Dimensions.get('window').height / 8,
    width: Dimensions.get('window').width - 10,
    justifyContent: 'center',
    paddingLeft: 30,
  },
  weekButton: {
    height: Dimensions.get('window').height / 16,
    width: Dimensions.get('window').width - 40,
    justifyContent: 'center',
    paddingLeft: 30,
  },
  weekContent: {
    height: Dimensions.get('window').height / 20,
    width: Dimensions.get('window').width - 40,
    justifyContent: 'center',
    paddingLeft: 30,
    backgroundColor: 'red',
  },
});
