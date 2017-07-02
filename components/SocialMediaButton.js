import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { WebBrowser } from 'expo';

import Images from '../constants/Images';

export default class SocialMediaButton extends React.Component {
  render() {
    const { network, style, spacing } = this.props;
    const imageSource =
      network === 'twitter' ? Images.twitterIcon : Images.githubIcon;
    const spacingShim = spacing === 'right' ? 'right' : 'left';

    return (
      <TouchableOpacity
        style={[styles[spacingShim], style]}
        onPress={this.props.onPress || this._handlePress}
        hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}>
        <Image source={imageSource} />
      </TouchableOpacity>
    );
  }

  _handlePress = () => {
    const { network, username } = this.props;

    if (network === 'twitter') {
      WebBrowser.openBrowserAsync(`https://twitter.com/${username}`);
    } else if (network === 'github') {
      WebBrowser.openBrowserAsync(`https://github.com/${username}`);
    }
  };
}

const styles = StyleSheet.create({
  left: { marginLeft: 30 },
  right: { marginRight: 30 },
});
