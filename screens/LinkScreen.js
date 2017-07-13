import React from 'react';
import { Platform, WebView } from 'react-native';

class LinkScreen extends React.Component {
  static navigationOptions = {
    title: 'Return to Resources',
    headerTintColor: 'black',
    headerStyle: {
      backgroundColor: '#bababa',
      paddingTop: 20,
      height: Platform.OS === 'ios' ? 80 : 100,
    },
  };

  render() {
    const { params } = this.props.navigation.state;
    return <WebView source={{ uri: params.url }} />;
  }
}

export default LinkScreen;
