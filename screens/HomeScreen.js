import React from 'react';
import {
  Text,
  Image,
  View,
  ListView,
  TouchableHighlight,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Card, CardImage } from 'react-native-card-view';
import loadData from '../utils/data-loader';

var BG_IMAGE = require('../assets/harvard.jpg');

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'CS50',
    headerTintColor: 'black',
    headerStyle: {
      backgroundColor: '#bababa',
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
      weekNumber: 0,
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

  onViewMaterialsPress() {
    //
  }

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
      <ScrollView>
        <Text
          style={{
            paddingTop: 30,
            paddingLeft: 30,
            fontFamily: 'roboto-bold',
            fontSize: 20,
          }}>
          this is
        </Text>
        <Text
          style={{
            paddingTop: 5,
            alignSelf: 'center',
            fontFamily: 'roboto-bold',
            fontSize: 50,
          }}>
          Week {this.state.weekNumber}
        </Text>
        <TouchableHighlight onPress={this.onViewMaterialsPress}>
          <Text
            style={{
              fontSize: 20,
              alignSelf: 'center',
              fontFamily: 'roboto-light',
            }}
            underlayColor="white">
            view course materials
          </Text>
        </TouchableHighlight>
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
      </ScrollView>
    );
  }
}

export default HomeScreen;
