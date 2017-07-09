import React from 'react';
import {
  Text,
  Image,
  View,
  ListView,
  TouchableHighlight,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo';
import { Card, CardImage } from 'react-native-card-view';
import loadData from '../utils/data-loader';

var BG_IMAGE = require('../assets/harvard.jpg');

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'CS50 Week by Week',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#821c21',
      paddingTop: 20,
      height: Platform.OS === 'ios' ? 80 : 100,
    },
  };

  constructor() {
    super();
    this.loadData_();
    var ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };
  }

  async loadData_() {
    var data = await loadData();
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(data),
    });

    // Note (Abi): Uncomment to debug the video screen
    // this.onWeekPress(this.state.dataSource.getRowData(0, 0));
  }

  onWeekPress = weekData => {
    this.props.navigation.navigate('Week', { data: weekData });
  };

  renderRowView(rowData) {
    return (
      <View style={{ paddingTop: 10, paddingBottom: 0 }}>
        <Card
          styles={{
            height: Dimensions.get('window').height / 7,
            width: Dimensions.get('window').width - 40,
            alignItems: 'flex-start',
          }}>
          <CardImage>
            <TouchableHighlight
              onPress={() => {
                this.onWeekPress(rowData);
              }}>
              <Image
                style={{
                  height: Dimensions.get('window').height / 8,
                  width: Dimensions.get('window').width - 10,
                  justifyContent: 'center',
                  paddingLeft: 30,
                }}
                source={BG_IMAGE}>
                <Text
                  style={{
                    fontFamily: 'roboto-light',
                    fontSize: 25,
                    color: 'white',
                    backgroundColor: 'transparent',
                    alignSelf: 'flex-start',
                  }}>
                  {rowData.title}
                </Text>
              </Image>
            </TouchableHighlight>
          </CardImage>
        </Card>
      </View>
    );
  }

  render() {
    return (
      <View>
        <LinearGradient colors={['#a73737', '#7a2828']}>
          <View
            style={{
              paddingLeft: 20,
              paddingRight: 20,
            }}>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderRowView.bind(this)}
              enableEmptySections={true}
            />
          </View>
        </LinearGradient>
      </View>
    );
  }
}

export default HomeScreen;
