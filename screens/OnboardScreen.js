import React from 'react';
import { View, TouchableHighlight, Text } from 'react-native';
import Swiper from 'react-native-swiper';
import Expo, { DangerZone } from 'expo';
const { Lottie } = DangerZone;
import styles from '../styles/style';
import colors from '../styles/colors';

class OnboardScreen extends React.Component {
  state = {
    animation: null,
  };

  componentWillMount() {
    this._loadAnimationAsync();
  }

  _loadAnimationAsync = async () => {
    let result = await fetch(
      'https://cdn.rawgit.com/airbnb/lottie-react-native/635163550b9689529bfffb77e489e4174516f1c0/example/animations/Watermelon.json'
    );

    this.setState({ animation: JSON.parse(result._bodyText) }, () => {
      this.animation.reset();
      this.animation.play();
    });
  };

  render() {
    const Panel = ({ text, style, animated }) => (
      <View
        style={[
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 30,
          },
          style,
        ]}>
        {animated &&
          this.state.animation && (
            <Lottie
              ref={animation => {
                this.animation = animation;
              }}
              style={{
                width: 400,
                height: 400,
                backgroundColor: colors.tertiary,
              }}
              source={this.state.animation}
            />
          )}
        <Text
          style={{
            color: colors.primary,
            fontSize: styles.fontSize(2),
            textAlign: 'center',
          }}>
          {text}
        </Text>
        <TouchableHighlight onPress={() => this.props.startApp()}>
          <Text>Go to app</Text>
        </TouchableHighlight>
      </View>
    );
    return (
      <Swiper loop={false} activeDotColor={colors.primary}>
        <Panel
          animated={true}
          style={{ backgroundColor: colors.tertiary }}
          text="Watch lectures and access course materials"
        />
        <Panel
          style={{ backgroundColor: '#97CAE5' }}
          text="Download lecture videos for offline viewing"
        />
        <Panel
          style={{ backgroundColor: '#92BBD9' }}
          text="Get notifications when lectures are posted"
        />
      </Swiper>
    );
  }
}

export default OnboardScreen;
