import React from 'react';
import {
  View,
  ListView,
  TouchableHighlight,
  Platform,
  Dimensions,
  ScrollView,
  Button,
} from 'react-native';
import { Card, CardImage } from 'react-native-card-view';
import { Text } from 'react-native-animatable';
import loadData from '../utils/data-loader';
import { colors, fontSize } from '../styles/style';
import debug from '../utils/debug';
import { NavigationActions } from 'react-navigation';
import Expo from 'expo';

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation;
    return {
      title: 'CS50',
      headerTintColor: 'black',
      headerBackTitle: 'Back',
      headerStyle: {
        //display: 'none', // Experiment
        backgroundColor: '#bababa',
        paddingTop: 20,
        height: Platform.OS === 'ios' ? 80 : 100,
      },
      headerRight: (
        <Button
          title={'Resources'}
          onPress={() => {
            navigation.navigate('Resources');
          }}
        />
      ),
    };
  };

  constructor() {
    super();
    this._loadData();
    var ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      weekNumber: 1,
      dataSource: ds.cloneWithRows([]),
      data: null,
    };
  }

  async _loadData() {
    var data = await loadData();
    this.setState({ data });
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(data),
    });

    if (debug.secondScreen) {
      this.onWeekPress(0);
    }

    if (debug.resourcesScreen) {
      this.props.navigation.navigate('Resources');
    }
  }

  onWeekPress(weekNumber) {
    var weekData = this.state.data[weekNumber];
    this.props.navigation.navigate('Week', {
      data: weekData,
      weekNum: weekNumber,
    });
  }

  renderRowView(rowData, sectionID, rowID) {
    return (
      <View
        style={{
          paddingTop: 10,
          paddingLeft: 0,
          paddingRight: 0,
          marginLeft: 0,
          marginRight: 0,
        }}>
        <Card
          styles={{
            height: Dimensions.get('window').height / 7,
            width: (Dimensions.get('window').width - 50) / 3,
            alignItems: 'center',
          }}>
          <CardImage>
            <TouchableHighlight
              onPress={() => {
                this.onWeekPress(rowID);
              }}
              style={{
                backgroundColor: colors.primary,
                height: Dimensions.get('window').height / 8,
                width: Dimensions.get('window').width / 3.5 - 20,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'roboto-light',
                  fontSize: fontSize(3),
                  color: colors.secondary,
                  backgroundColor: 'transparent',
                  alignSelf: 'center',
                }}>
                {rowData.weekNumber}
              </Text>
            </TouchableHighlight>
          </CardImage>
        </Card>
      </View>
    );
  }

  render() {
    const CurrentWeekSection = ({ weekNumber }) =>
      <View style={{ marginTop: 60 }}>
        <Text
          style={{
            fontFamily: 'roboto-bold',
            fontSize: 20,
          }}>
          this is
        </Text>
        <TouchableHighlight
          onPress={() => {
            this.onWeekPress(weekNumber);
          }}>
          <View>
            <Text
              ref={c => (this.text = c)}
              style={{
                paddingTop: 10,
                alignSelf: 'center',
                fontFamily: 'roboto-bold',
                fontSize: 50,
              }}>
              Week {weekNumber}
            </Text>
            <Text
              style={{
                paddingTop: 20,
                fontSize: 16,
                alignSelf: 'center',
                fontFamily: 'roboto-light',
                color: colors.primary,
              }}
              underlayColor="white">
              view course materials
            </Text>
          </View>
        </TouchableHighlight>
      </View>;

    const AdjacentWeekButton = ({ text, align, disabled, onPress }) =>
      <TouchableHighlight
        style={{
          paddingLeft: 25,
          paddingRight: 25,
          paddingBottom: 25,
          paddingTop: 45,
          height: 100,
          backgroundColor: disabled ? colors.secondary : colors.primary,
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          borderRadius: 5,
        }}
        onPress={disabled ? void 0 : onPress}>
        <Text
          style={{
            fontFamily: 'roboto-light',
            fontSize: 20,
            color: colors.secondary,
            paddingLeft: 7,
            textAlign: align,
          }}>
          {text}
        </Text>
      </TouchableHighlight>;

    return (
      <View style={{ marginTop: Expo.Constants.statusBarHeight }}>
        <ScrollView contentContainerStyle={{ marginLeft: 20, marginRight: 20 }}>
          <CurrentWeekSection weekNumber={this.state.weekNumber} />
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginTop: 60,
              marginBottom: 10,
            }}>
            <AdjacentWeekButton
              text="last week"
              align="left"
              disabled={this.state.weekNumber - 1 < 0}
              onPress={() => {
                this.onWeekPress(this.state.weekNumber - 1);
              }}
            />
            <AdjacentWeekButton
              text="next week"
              align="right"
              disabled={
                this.state.data &&
                this.state.weekNumber + 1 > this.state.data.length
              }
              onPress={() => {
                this.onWeekPress(this.state.weekNumber + 1);
              }}
            />
          </View>
          {/* All weeks section */}
          <View style={{ marginTop: 60 }}>
            <Text
              style={{
                fontFamily: 'roboto-bold',
                fontSize: 20,
              }}>
              all weeks
            </Text>
            <View
              style={{
                paddingBottom: 10,
              }}>
              <ListView
                contentContainerStyle={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}
                dataSource={this.state.dataSource}
                renderRow={this.renderRowView.bind(this)}
                enableEmptySections={true}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default HomeScreen;
