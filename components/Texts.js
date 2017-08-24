import React from 'react';
import { Text } from 'react-native';

const generateTextComponent = ({ style = {}, children, ...otherProps }, font) =>
  <Text {...otherProps} style={[{ fontFamily: font }, style]}>
    {children}
  </Text>;

export class BoldText extends React.Component {
  render = () => generateTextComponent(this.props, 'roboto-bold');
}

export class LightText extends React.Component {
  render = () => generateTextComponent(this.props, 'roboto-light');
}

export class RegularText extends React.Component {
  render = () => generateTextComponent(this.props, 'roboto-regular');
}
