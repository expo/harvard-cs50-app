import React from 'react';
import {
  View,
  ListView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Text,
  StatusBar,
} from 'react-native';
import Expo from 'expo';
import { Ionicons } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';

import loadData from '../utils/data-loader';
import styles from '../styles/style';
import colors from '../styles/colors';
import config from '../utils/config';
import Row from '../components/Row';
import WeekBox from '../components/WeekBox';

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'CS50',
      headerTintColor: styles.headerTintColor,
      headerBackTitle: 'Back',
      headerStyle: styles.headerStyle,
      headerTitleStyle: {
        fontFamily: 'roboto-black',
        fontSize: styles.fontSize(1),
        letterSpacing: -0.4,
      },
      headerRight: (
        <TouchableOpacity
          style={{ marginRight: 20 }}
          onPress={() => {
            navigation.navigate('Resources');
          }}>
          <Ionicons name="md-list-box" size={28} color={colors.secondary} />
        </TouchableOpacity>
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
      weekNumber: 4,
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

    if (config.secondScreen) {
      this.onWeekPress(this.state.weekNumber);
    }

    if (config.resourcesScreen) {
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
      <Row
        text={rowData.title + ' / ' + rowData.desc}
        onPress={this.onWeekPress.bind(this, [rowID])}
      />
    );
  }

  render() {
    // Images associated with lecture
    // require('../assets/memory.png')

    const BrowseSection = ({ weekNumber }) => {
      const itemHorizontalMargin = 10;
      const itemWidth =
        Dimensions.get('window').width + itemHorizontalMargin * 2 - 60;
      return (
        <View style={{ marginTop: 40 }}>
          <StatusBar barStyle="dark-content" />
          <Text
            style={[
              {
                fontSize: styles.fontSize(2),
                letterSpacing: -1,
                color: colors.primary,
                fontFamily: 'roboto-black',
                marginBottom: 15,
              },
              styles.mainViewStyle,
            ]}>
            Browse Lectures
          </Text>
          {this.state.data &&
            <Carousel
              containerCustomStyle={{ marginTop: 20 }}
              ref={carousel => {
                this._carousel = carousel;
              }}
              inactiveSlideOpacity={0.5}
              inactiveSlideScale={1}
              enableMomentum={false}
              firstItem={weekNumber}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={itemWidth}>
              {this.state.data.map(week => {
                var headingText = 'WEEK ' + week.weekNumber;
                switch (week.weekNumber) {
                  case weekNumber:
                    headingText = 'THIS WEEK';
                    break;
                  case weekNumber - 1:
                    headingText = 'LAST WEEK';
                    break;
                  case weekNumber + 1:
                    headingText = 'NEXT WEEK';
                  default:
                    break;
                }

                return (
                  <View
                    key={week.title}
                    style={{
                      width: itemWidth,
                      paddingHorizontal: itemHorizontalMargin,
                    }}>
                    <View
                      style={{
                        borderTopColor: colors.primary,
                        borderTopWidth: 1,
                      }}>
                      <Text
                        style={{
                          color: colors.primary,
                          marginTop: 10,
                          marginBottom: 10,
                        }}>
                        {headingText}
                      </Text>
                      <WeekBox
                        onPress={() => this.onWeekPress(week.weekNumber)}
                        key={'entry-${index}'}
                        imageWidth={
                          (itemWidth - itemHorizontalMargin * 2) * 1 / 3
                        }
                        textWidth={
                          (itemWidth - itemHorizontalMargin * 2) * 2 / 3
                        }
                        source={require('../assets/memory.png')}
                        title={week.title.toLowerCase()}
                        desc={week.desc.toLowerCase()}
                        weekNumber={week.weekNumber}
                      />
                    </View>
                  </View>
                );
              })}
            </Carousel>}
        </View>
      );
    };

    return (
      <View style={{ backgroundColor: 'white' }}>
        <ScrollView>
          <BrowseSection weekNumber={this.state.weekNumber} />
          {/* All weeks section */}
          <View style={{ marginTop: 60 }}>
            <View
              style={[
                {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.primary,
                },
                styles.mainViewStyle,
              ]}>
              <Text
                style={[
                  {
                    fontFamily: 'roboto-black',
                    color: colors.primary,
                    paddingBottom: 10,
                    fontSize: styles.fontSize(2),
                    letterSpacing: -1,
                  },
                ]}>
                All Weeks
              </Text>
            </View>
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
