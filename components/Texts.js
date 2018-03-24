import React from 'react';
import { Text } from 'react-native';

const generateTextComponent = (
  { style = {}, children, ...otherProps },
  font
) => (
  <Text {...otherProps} style={[{ fontFamily: font }, style]}>
    {children}
  </Text>
);

export class LightText extends React.Component {
  render = () => generateTextComponent(this.props, 'custom-light');
}

export class RegularText extends React.Component {
  render = () => generateTextComponent(this.props, 'custom-regular');
}

export class BoldText extends React.Component {
  render = () => generateTextComponent(this.props, 'custom-bold');
}
