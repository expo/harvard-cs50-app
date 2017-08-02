import React from 'react';
import { ScrollView, Text } from 'react-native';
import Row from '../components/Row';
import CrossTouchable from '../components/CrossTouchable';
import { colors } from '../styles/style';

const RESOURCES = [
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

class ResourcesScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Resources',
      headerTintColor: styles.headerTintColor,
      headerStyle: styles.headerStyle,
      headerMode: 'float',
      headerRight: (
        <CrossTouchable
          style={{ paddingRight: 20 }}
          hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
          onPress={() => {
            // Because this header is in the second-level navigator, to go back to the first-level navigator, we can `null`
            // to go back anywhere
            navigation.goBack(null);
          }}>
          <Text style={{ color: colors.tertiary }}>Close</Text>
        </CrossTouchable>
      ),
    };
  };

  onButtonPress = url => {
    this.props.navigation.navigate('Link', { url: url });
  };

  render() {
    return (
      <ScrollView>
        {RESOURCES.map(resource => {
          return (
            <Row
              key={resource.url}
              text={resource.name}
              onPress={() => this.onButtonPress(resource.url)}
            />
          );
        })}
      </ScrollView>
    );
  }
}

export default ResourcesScreen;
