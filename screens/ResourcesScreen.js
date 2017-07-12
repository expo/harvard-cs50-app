import {
  View,
  ListView,
  TouchableHighlight,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Text } from 'react-native-animatable';
import loadData from '../utils/data-loader';
import { colors, fontSize, headerStyle, mainViewStyle } from '../styles/style';
import React from 'react';
import _ from 'lodash';

class ResourcesScreen extends React.Component {
  static navigationOptions = {
    title: 'Resources',
    headerStyle: headerStyle,
  };

  onButtonPress = url => {
    this.props.navigation.navigate('Link', { url: url });
  };

  render() {
    const resources = [
      { name: 'Discuss', url: 'https://cs50.net/discuss' },
      { name: 'Gradebook', url: 'http://cs50.net/gradebook' },
      { name: 'Study', url: 'https://study.cs50.net/' },
      { name: 'Reference', url: 'https://reference.cs50.net' },
      { name: 'Style Guide', url: 'https://manual.cs50.net/style/' },
      { name: 'Final project', url: 'https://cs50.harvard.edu/project' },
      { name: 'Seminars', url: 'https://manual.cs50.net/seminars/' },
      { name: 'Staff', url: 'https://cs50.harvard.edu/staff' },
      { name: 'Sections', url: 'https://cs50.harvard.edu/sections' },
      { name: 'FAQs', url: 'https://cs50.harvard.edu/faqs' },
    ];

    const Link = props =>
      <TouchableHighlight
        onPress={() => {
          this.onButtonPress(props.url);
        }}>
        <Text
          style={{
            fontSize: 20,
            color: 'black',
            marginBottom: 10,
          }}>
          {props.name}
        </Text>
      </TouchableHighlight>;

    return (
      <View style={[mainViewStyle, { marginTop: 20 }]}>
        {_.map(resources, link => {
          return <Link key={link.url} name={link.name} url={link.url} />;
        })}
      </View>
    );
  }
}

export default ResourcesScreen;
