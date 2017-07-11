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
import { colors, fontSize } from '../styles/style';

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
    this._loadData();
    var ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      weekNumber: 0,
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

    // Note (Abi): Uncomment to debug the video screen
    // this.onWeekPress(this.state.dataSource.getRowData(0, 0));
  }

  onWeekPress = (weekData, sectionID, rowID) => {
    this.props.navigation.navigate('Week', { data: weekData, weekNum: rowID });
  };

  onViewMaterialsPress() {
    var num = this.state.weekNumber;
    var weekData = this.state.data;
    this.props.navigation.navigate('Week', {
      data: weekData[num],
      weekNum: num,
    });
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

  getWeekNumber(title) {
    var num = title.charAt(title.length - 1);
    if (title.charAt(title.length - 2) === '1') {
      num = '1' + num;
    }
    return num;
  }

  renderRowView(rowData) {
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
                this.onWeekPress(rowData);
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
                {this.getWeekNumber(rowData.title)}
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
        <TouchableHighlight onPress={this.onViewMaterialsPress.bind(this)}>
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

    const AdjacentWeekButton = ({ text, align, onPress }) =>
      <TouchableHighlight
        style={{
          paddingLeft: 25,
          paddingRight: 25,
          paddingBottom: 25,
          paddingTop: 45,
          height: 100,
          backgroundColor: colors.primary,
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          borderRadius: 5,
        }}
        onPress={onPress}>
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
            onPress={this.onLastPress.bind(this)}
          />
          <AdjacentWeekButton
            text="next week"
            align="right"
            onPress={this.onNextPress.bind(this)}
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
    );
  }
}

export default HomeScreen;
