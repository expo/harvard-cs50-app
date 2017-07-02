import React from 'react';
import { LinearGradient } from 'expo';
import Colors from '../constants/Colors';

export default class PurpleGradient extends React.PureComponent {
  render() {
    const gradient = [Colors.purple, Colors.darkPurple];

    return (
      <LinearGradient colors={gradient} style={this.props.style}>
        {this.props.children}
      </LinearGradient>
    );
  }
}
