import React from 'react';
import { Text, View, Platform } from 'react-native';

class LectureScreen extends React.Component {
  static navigationOptions = {
    title: 'Week Details',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#821c21',
      paddingTop: 20,
      height: Platform.OS === 'ios' ? 80 : 100,
    },
  };

  render() {
    const { params } = this.props.navigation.state;
    return (
      <View>
        <Text>
          Details for the lecture in {params.data[0].value}
        </Text>
        <Text>
          Topic of the week: {params.data[1].value}
        </Text>
        <Text>
          Link to {params.data[2].children[0].value}:{' '}
          {params.data[2].children[1].attributes.href}
        </Text>
        <Text>
          Link to {params.data[3].children[0].value}:{' '}
          {params.data[3].children[1].attributes.href}
        </Text>
        <Text>
          Link to {params.data[4].children[0].value}:{' '}
          {params.data[4].children[1].attributes.href}
        </Text>
        <Text>
          Link to {params.data[5].children[0].value}:{' '}
          {params.data[5].children[1].attributes.href}
        </Text>
        <Text>
          Link to {params.data[6].children[0].value}:{' '}
          {params.data[6].children[1].attributes.href}
        </Text>
        <Text>
          Link to {params.data[7].children[0].value}:{' '}
          {params.data[7].children[1].attributes.href}
        </Text>
        <Text>
          Link to {params.data[8].children[0].value}:{' '}
          {params.data[8].children[1].children[2].attributes.href}
        </Text>
      </View>
    );
  }
}

export default LectureScreen;
