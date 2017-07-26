import React from 'react';
import { Text, View, Dimensions, TouchableHighlight } from 'react-native';
import { ScreenOrientation, FileSystem, Video } from 'expo';
import _ from 'lodash';

import VideoPlayer from '../components/VideoPlayer';
import Row from '../components/Row';

import styles from '../styles/style';

class WeekScreen extends React.Component {
  state = {
    isPortrait: true,
    localVideoUri: null,
  };

  static navigationOptions = ({ navigation }) => ({
    title: `Week ${navigation.state.params.weekNum}`,
    headerTintColor: styles.headerTintColor,
    headerStyle: navigation.state.params.hideHeader
      ? { display: 'none', opacity: 0 }
      : styles.headerStyle,
  });

  constructor() {
    super();
    this.orientationChangeHandler = this.orientationChangeHandler.bind(this);
    this.saveToDisk = this.saveToDisk.bind(this);
  }

  saveToDisk(url) {
    console.log('Save to disk', url);
    this.savedUrl = FileSystem.documentDirectory + 'test.mp4';
    Expo.FileSystem
      .downloadAsync(
        'http://techslides.com/demos/sample-videos/small.mp4',
        this.savedUrl
      )
      .then(({ uri }) => {
        console.log('Finished downloading', uri, this.savedUrl);
        this.setState({ localVideoUri: uri });
      })
      .catch(error => {
        console.error(error);
      });
  }

  orientationChangeHandler(dims) {
    const { width, height } = dims.window;
    const isLandscape = width > height;
    this.setState({ isPortrait: !isLandscape });
    this.props.navigation.setParams({ hideHeader: isLandscape });
    ScreenOrientation.allow(ScreenOrientation.Orientation.ALL);
  }

  // Only on this screen, allow landscape orientations
  componentDidMount() {
    ScreenOrientation.allow(ScreenOrientation.Orientation.ALL);
    Dimensions.addEventListener('change', this.orientationChangeHandler);
  }

  componentWillUnmount() {
    ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT);
    Dimensions.removeEventListener('change', this.orientationChangeHandler);
  }

  onButtonPress = url => {
    this.props.navigation.navigate('Link', { url: url });
  };

  onFullscreen() {
    ScreenOrientation.allow(ScreenOrientation.Orientation.LANDSCAPE);
  }

  onUnFullscreen() {
    ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT);
  }

  render() {
    const data = this.props.navigation.state.params.data;

    var linkKeys = ['slides', 'source code', 'notes'];
    var links = _.pickBy(data, (v, k) => linkKeys.includes(k));

    return (
      <View
        style={{
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexDirection: 'column',
          // paddingTop: 20,
        }}>
        <VideoPlayer
          sources={data.videos}
          id={data.title}
          isPortrait={this.state.isPortrait}
          onFullscreen={this.onFullscreen.bind(this)}
          onUnFullscreen={this.onUnFullscreen.bind(this)}
        />

        {this.state.localVideoUri &&
          <Video
            source={{
              uri: this.state.localVideoUri,
            }}
            resizeMode={Video.RESIZE_MODE_CONTAIN}
            style={{
              width: 200,
              height: 300,
            }}
            shouldPlay={true}
          />}

        <View
          style={{
            marginLeft: 20,
            marginRight: 20,
          }}>
          <TouchableHighlight
            style={{ display: this.state.isPortrait ? 'flex' : 'none' }}
            onPress={() => {
              {
                /* console.log(data.videos.sources); */
              }
              this.saveToDisk(data.videos['240p']);
            }}>
            <Text>save for offline</Text>
          </TouchableHighlight>
        </View>
        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexDirection: 'column',
            display: this.state.isPortrait ? 'flex' : 'none',
            marginLeft: 20,
            marginRight: 20,
          }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
            course materials
          </Text>
          {_.map(links, (url, name) => {
            return (
              <Row
                key={url}
                text={name}
                onPress={() => this.onButtonPress(url)}
              />
            );
          })}
        </View>
      </View>
    );
  }
}

export default WeekScreen;
