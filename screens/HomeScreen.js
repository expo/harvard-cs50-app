import React from 'react';
import {
  View,
  ListView,
  TouchableHighlight,
  Platform,
  Dimensions,
  ScrollView,
  Button as RNButton,
  Image,
} from 'react-native';
import { Text } from 'react-native-animatable';
import loadData from '../utils/data-loader';
import styles, { colors, fontSize } from '../styles/style';
import config from '../utils/config';
import Expo from 'expo';
import Button from '../components/Button';
import Row from '../components/Row';
import { Ionicons } from '@expo/vector-icons';

import Carousel from 'react-native-snap-carousel';


class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'CS50',
      headerTintColor: styles.headerTintColor,
      headerBackTitle: 'Back',
      headerStyle: styles.headerStyle,
      headerRight: (
        <TouchableHighlight
          style={{ paddingRight: 20 }}
          onPress={() => {
            navigation.navigate('Resources');
          }}>
          <Ionicons name="md-list-box" size={28} color={colors.tertiary} />
        </TouchableHighlight>
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

    if (config.secondScreen) {
      this.onWeekPress(0);
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
        onPress={() => this.onWeekPress(rowID)}
      />
    );
  }

  render() {
    const BrowseSection = ({ weekNumber }) => {
      const textStyle = { color: colors.primary, fontSize: fontSize(2) };
      const itemHorizontalMargin = 10;
      const itemWidth =
        Dimensions.get('window').width + itemHorizontalMargin * 2 - 80;
      return (
        <View style={{ marginTop: 40 }}>
          <Text
            style={[
              {
                fontSize: fontSize(2),
                letterSpacing: -1,
                color: colors.primary,
                fontFamily: 'roboto-black',
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
              inactiveSlideOpacity={1}
              inactiveSlideScale={1}
              enableMomentum={false}
              firstItem={4}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={itemWidth}>
              {this.state.data.map((week, index) =>
                <View
                  key={week.title}
                  style={{
                    borderTopColor: colors.primary,
                    borderTopWidth: 1,
                    width: itemWidth,
                    paddingHorizontal: itemHorizontalMargin,
                  }}>
                  <Text style={{ color: colors.primary, marginTop: 10 }}>
                    THIS WEEK
                  </Text>
                  <TouchableHighlight
                    onPress={() => this.onWeekPress(week.weekNumber)}>
                    <View
                      key={`entry-${index}`}
                      style={{
                        paddingTop: 50,
                        paddingBottom: 50,
                        marginTop: 10,
                        borderRadius: 5,
                        borderWidth: 2,
                        borderColor: colors.primary,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          width: (itemWidth - itemHorizontalMargin * 2) * 1 / 3,
                          alignItems: 'center',
                        }}>
                        <Image
                          source={require('../assets/memory.png')}
                          fadeDuration={0}
                          style={{ width: 50, height: 60 }}
                        />
                      </View>
                      <View
                        style={{
                          width: (itemWidth - itemHorizontalMargin * 2) * 2 / 3,
                          alignItems: 'flex-start',
                        }}>
                        <Text style={textStyle} numberOfLines={1}>
                          {week.title.toLowerCase()}
                        </Text>
                        <Text style={textStyle} numberOfLines={1}>
                          {week.desc.toLowerCase()}
                        </Text>
                      </View>
                    </View>
                  </TouchableHighlight>
                </View>
              )}
            </Carousel>}
        </View>
      );
    };

    return (
      <View>
        <ScrollView>
          <BrowseSection weekNumber={this.state.weekNumber} />
          {/* All weeks section */}
          <View style={{ marginTop: 60 }}>
            <Text
              style={[
                {
                  fontFamily: 'roboto-black',
                  fontSize: fontSize(1),
                  color: colors.primary,
                  paddingBottom: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.primary,
                },
                styles.mainViewStyle,
              ]}>
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
