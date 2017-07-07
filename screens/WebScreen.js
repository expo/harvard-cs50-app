import React from 'react';
import {
  Text,
  Image,
  View,
  ListView,
  TouchableHighlight,
  Platform,
  StyleSheet,
  Dimensions,
  WebView
} from 'react-native';
import { LinearGradient } from 'expo';
import { Card, CardImage } from 'react-native-card-view';

class WebScreen extends React.Component {

  static navigationOptions = {
    title: 'Return to Week Details',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor:'#821c21',
      paddingTop: 20,
      height: (Platform.OS === 'ios') ? 80 : 100,
    }
  };

  render() {
    const { params } = this.props.navigation.state;
    return (
      <WebView
        source={{ uri: params.url }}
        style={{ marginTop: 0 }}
      />
    );
  }
}

export default WebScreen;
