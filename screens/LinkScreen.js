import React from 'react';
import { WebView } from 'react-native';
import styles from '../styles/style';

class LinkScreen extends React.Component {
  static navigationOptions = {
    title: 'Return to Resources',
    headerTintColor: styles.headerTintColor,
    headerStyle: styles.headerStyle,
  };

  render() {
    const { params } = this.props.navigation.state;
    return <WebView source={{ uri: params.url }} />;
  }
}

export default LinkScreen;
