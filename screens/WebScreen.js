import React from 'react';
import { Platform, WebView } from 'react-native';

class WebScreen extends React.Component {
  static navigationOptions = {
    title: 'Return to Week Details',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#821c21',
      paddingTop: 20,
      height: Platform.OS === 'ios' ? 80 : 100,
    },
  };

  render() {
    const { params } = this.props.navigation.state;
    return <WebView source={{ uri: params.url }} />;
  }
}

export default WebScreen;
