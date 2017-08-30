import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';

import Row from '../components/Row';
import { RegularText } from '../components/Texts';

import colors from '../styles/colors';
import styles from '../styles/style';

const RESOURCES = [
  { name: 'Discuss', url: 'https://cs50.net/discuss', icon: 'wechat' },
  { name: 'Gradebook', url: 'http://cs50.net/gradebook', icon: 'thumbs-up' },
  { name: 'Study', url: 'https://study.cs50.net/', icon: 'book' },
  { name: 'Reference', url: 'https://reference.cs50.net', icon: 'list-ul' },
  {
    name: 'Style Guide',
    url: 'https://manual.cs50.net/style/',
    icon: 'deviantart',
  },
  {
    name: 'Final project',
    url: 'https://cs50.harvard.edu/project',
    icon: 'flask',
  },
  {
    name: 'Seminars',
    url: 'https://manual.cs50.net/seminars/',
    icon: 'graduation-cap',
  },
  { name: 'Staff', url: 'https://cs50.harvard.edu/staff', icon: 'child' },
  { name: 'Sections', url: 'https://cs50.harvard.edu/sections', icon: 'group' },
  {
    name: 'FAQs',
    url: 'https://cs50.harvard.edu/faqs',
    icon: 'question-circle-o',
  },
  {
    name: 'Credits',
    url: 'https://gist.github.com/abi/05c7a199ced36d56da5a2fe3a4a52829',
    icon: 'heart',
  },
];

class ResourcesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Resources',
      headerTintColor: styles.headerTintColor,
      headerTitleStyle: styles.headerTitleStyle,
      headerStyle: styles.headerStyle,
      headerBackTitle: 'Back',
      headerMode: 'float',
      headerRight: (
        <TouchableOpacity
          style={{ paddingRight: 20 }}
          hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
          onPress={() => {
            // Because this header is in the second-level navigator, to go back to the first-level navigator, we can `null`
            // to go back anywhere
            navigation.goBack(null);
          }}>
          <RegularText
            style={{ color: colors.primary, fontSize: styles.fontSize(0) }}>
            Close
          </RegularText>
        </TouchableOpacity>
      ),
    };
  };

  onPress = (url, title) => {
    this.props.navigation.navigate('Link', { url, title });
  };

  render() {
    return (
      <ScrollView style={{ backgroundColor: 'white' }}>
        {RESOURCES.map(({ url, name, icon }) =>
          <Row
            key={url}
            text={name}
            onPress={this.onPress.bind(this, url, name)}
            icon={icon}
          />
        )}
      </ScrollView>
    );
  }
}

export default ResourcesScreen;
