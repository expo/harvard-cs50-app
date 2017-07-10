import React from 'react';
import {
  View,
  ListView,
  TouchableHighlight,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Card, CardImage } from 'react-native-card-view';
import { Text } from 'react-native-animatable';
import loadData from '../utils/data-loader';
import * as Animatable from 'react-native-animatable';


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

  onLastPress() {
    if (this.state.weekNumber != 0) {
      this.setState({
        weekNumber: this.state.weekNumber - 1,
      });
      this.text.fadeInLeft(800);
    }
  }

  onNextPress() {
    if (this.state.weekNumber != 11) {
      this.setState({
        weekNumber: this.state.weekNumber + 1,
      });
      this.text.fadeInRight(800);
    }
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
              }}
              style={{
                backgroundColor: '#bababa',
                height: Dimensions.get('window').height / 8,
                width: Dimensions.get('window').width - 10,
                paddingLeft: 30,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'roboto-light',
                  fontSize: 25,
                  color: '#555556',
                  backgroundColor: 'transparent',
                  alignSelf: 'flex-start',
                }}>
                {rowData.title}
              </Text>
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
        <TouchableHighlight onPress={this.onViewMaterialsPress.bind(this)}>
          <View>
            <Text
              ref={c => (this.text = c)}
              style={{
                paddingTop: 5,
                alignSelf: 'center',
                fontFamily: 'roboto-bold',
                fontSize: 50,
              }}>
              Week {this.state.weekNumber}
            </Text>
            <Text
              style={{
                fontSize: 20,
                alignSelf: 'center',
                fontFamily: 'roboto-light',
                color: '#555556',
              }}
              underlayColor="white">
              view course materials
            </Text>
          </View>
        </TouchableHighlight>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            paddingLeft: 25,
            paddingRight: 25,
            paddingTop: 10,
            paddingBottom: 10,
          }}>
          <TouchableHighlight
            style={{
              flex: 0.9,
              paddingLeft: 5,
              paddingRight: 5,
              height: 100,
              backgroundColor: '#bababa',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
            }}
            onPress={this.onLastPress.bind(this)}>
            <View>
              <Text
                style={{
                  fontFamily: 'roboto-light',
                  fontSize: 20,
                  color: '#555556',
                  paddingLeft: 7,
                }}>
                last
              </Text>
              <Text
                style={{
                  fontFamily: 'roboto-light',
                  fontSize: 20,
                  color: '#555556',
                  paddingBottom: 7,
                  paddingLeft: 7,
                }}>
                week
              </Text>
            </View>
          </TouchableHighlight>
          <Text> </Text>
          <Text> </Text>
          <Text> </Text>
          <TouchableHighlight
            style={{
              flex: 0.9,
              height: 100,
              backgroundColor: '#bababa',
              justifyContent: 'flex-end',
            }}
            onPress={this.onNextPress.bind(this)}>
            <View>
              <Text
                style={{
                  fontFamily: 'roboto-light',
                  fontSize: 20,
                  color: '#555556',
                  paddingRight: 10,
                  textAlign: 'right',
                }}>
                next
              </Text>
              <Text
                style={{
                  fontFamily: 'roboto-light',
                  fontSize: 20,
                  color: '#555556',
                  paddingBottom: 7,
                  paddingRight: 10,
                  textAlign: 'right',
                }}>
                week
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        <Text
          style={{
            paddingTop: 30,
            paddingLeft: 40,
            fontFamily: 'roboto-bold',
            fontSize: 20,
          }}>
          all weeks
        </Text>
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
