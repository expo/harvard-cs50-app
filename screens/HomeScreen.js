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
import { connect } from 'react-redux';

import styles from '../styles/style';
import colors from '../styles/colors';
import config from '../utils/config';
import Row from '../components/Row';
import WeekBox from '../components/WeekBox';
import { BoldText, LightText } from '../components/Texts';

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'CS50',
      headerTintColor: styles.headerTintColor,
      headerBackTitle: 'Back',
      headerStyle: styles.headerStyle,
      headerTitleStyle: styles.headerTitleStyle,
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

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      weekNumber: 0,
      dataSource: ds.cloneWithRows(props.data),
      data: props.data,
    };
  }

  componentDidMount() {
    // if (config.secondScreen) {
    //   this.onWeekPress(this.state.weekNumber);
    // }
    // if (config.resourcesScreen) {
    //   this.props.navigation.navigate('Resources');
    // }
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
    const BrowseSection = ({ weekNumber }) => {
      const itemHorizontalMargin = 10;
      const itemWidth =
        Dimensions.get('window').width + itemHorizontalMargin * 2 - 60;
      return (
        <View style={{ marginTop: 40 }}>
          <StatusBar barStyle="dark-content" />
          <BoldText
            style={[
              {
                fontSize: styles.fontSize(2),
                letterSpacing: -1,
                color: colors.primary,
                marginBottom: 15,
              },
              styles.mainViewStyle,
            ]}>
            Browse Lectures
          </BoldText>
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
                      <LightText
                        style={{
                          color: colors.primary,
                          marginTop: 10,
                          marginBottom: 10,
                        }}>
                        {headingText}
                      </LightText>
                      <WeekBox
                        onPress={() => this.onWeekPress(week.weekNumber)}
                        key={'entry-${index}'}
                        imageWidth={
                          (itemWidth - itemHorizontalMargin * 2) * 1 / 3
                        }
                        textWidth={
                          (itemWidth - itemHorizontalMargin * 2) * 2 / 3
                        }
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
              <BoldText
                style={{
                  color: colors.primary,
                  paddingBottom: 10,
                  fontSize: styles.fontSize(2),
                  letterSpacing: -1,
                }}>
                All Weeks
              </BoldText>
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

const mapStateToProps = state => {
  return {
    data: state.courseData,
  };
};

export default connect(mapStateToProps)(HomeScreen);
