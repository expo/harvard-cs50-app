import React from 'react';
import {
  View,
  ListView,
  TouchableHighlight,
  Platform,
  Dimensions,
  ScrollView,
  Button as RNButton,
} from 'react-native';
import { Card, CardImage } from 'react-native-card-view';
import { Text } from 'react-native-animatable';
import loadData from '../utils/data-loader';
import styles, { colors, fontSize } from '../styles/style';
import debug from '../utils/debug';
import { NavigationActions } from 'react-navigation';
import Expo from 'expo';
import Button from '../components/Button';

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'CS50',
      headerTintColor: styles.headerTintColor,
      headerBackTitle: 'Back',
      headerStyle: styles.headerStyle,
      headerRight: (
        <RNButton
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
    class Row extends React.Component {
      constructor(props) {
        super(props);
        this.state = { pressed: false };
      }

      render() {
        return (
          <TouchableHighlight
            onPress={this.props.onPress}
            underlayColor={colors.primary}
            onPressIn={() => {
              this.setState({ pressed: true });
            }}
            onPressOut={() => {
              this.setState({ pressed: false });
            }}
            style={{
              justifyContent: 'center',
              paddingTop: 20,
              paddingBottom: 20,
              borderBottomWidth: 1,
              borderBottomColor: colors.primary,
            }}>
            <Text
              style={{
                fontFamily: 'roboto-light',
                fontSize: fontSize(1),
                color: this.state.pressed ? 'white' : colors.secondary,
                alignSelf: 'flex-start',
              }}>
              {this.props.rowData.title} / {this.props.rowData.desc}
            </Text>
          </TouchableHighlight>
        );
      }
    }

    return (
      <Row
        rowData={rowData}
        rowID={rowID}
        onPress={() => this.onWeekPress(rowID)}
      />
    );
  }

  render() {
    const BrowseSection = ({ weekNumber }) =>
      <View style={{ marginTop: 40 }}>
        <Text
          style={{
            fontSize: fontSize(2),
            letterSpacing: -1,
            color: colors.primary,
            fontFamily: 'roboto-black',
          }}>
          Browse Lectures
        </Text>
      </View>;

    return (
      <View>
        <ScrollView contentContainerStyle={{ marginLeft: 20, marginRight: 20 }}>
          <BrowseSection weekNumber={this.state.weekNumber} />
          {/* All weeks section */}
          <View style={{ marginTop: 60 }}>
            <Text
              style={{
                fontFamily: 'roboto-black',
                fontSize: fontSize(1),
                color: colors.primary,
                paddingBottom: 10,
                borderBottomWidth: 1,
                borderBottomColor: colors.primary,
              }}>
              all weeks
            </Text>
            <ListView
              contentContainerStyle={{
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              dataSource={this.state.dataSource}
              renderRow={this.renderRowView.bind(this)}
              enableEmptySections={true}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default HomeScreen;
