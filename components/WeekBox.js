import React from 'react';
import { Text, View, Image, TouchableHighlight } from 'react-native';
import styles from '../styles/style';
import colors from '../styles/colors';

import AlgorithmsIcon from '../components/svgs/algorithms';
import ArraysIcon from '../components/svgs/Arrays';
import HttpIcon from '../components/svgs/Http';
import MachinelearningIcon from '../components/svgs/Machinelearning';
import PythonIcon from '../components/svgs/Python';
import DatastructuresIcon from '../components/svgs/Datastructures';
import MemoryIcon from '../components/svgs/Memory';
import ScratchIcon from '../components/svgs/Scratch';
import CIcon from '../components/svgs/C';
import SqlIcon from '../components/svgs/Sql';
import CelebrationIcon from '../components/svgs/Celebration';
import JavascriptIcon from '../components/svgs/Javascript';

const IconMappings = [
  ScratchIcon,
  CIcon,
  ArraysIcon,
  AlgorithmsIcon,
  MemoryIcon,
  DatastructuresIcon,
  HttpIcon,
  MachinelearningIcon,
  PythonIcon,
  SqlIcon,
  JavascriptIcon,
  CelebrationIcon,
];

class WeekBox extends React.Component {
  state = {
    active: false,
  };
  render() {
    const textStyle = {
      color: this.state.active ? colors.complementary : colors.primary,
      fontSize: styles.fontSize(2),
    };
    const Icon = IconMappings[this.props.weekNumber];
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        style={{
          borderRadius: 5,
          borderWidth: 2,
          borderColor: colors.primary,
          //backgroundColor: colors.secondary,
        }}
        onShowUnderlay={() => this.setState({ active: true })}
        onHideUnderlay={() => this.setState({ active: false })}
        underlayColor={colors.secondary}>
        <View
          style={{
            paddingTop: 50,
            paddingBottom: 50,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 100,
              height: 100,
              alignItems: 'center',
              //borderWidth: 1,
              //borderColor: 'black',
              marginLeft: 10,
              marginRight: 10,
            }}>
            <Icon />
            {/* <Image
              source={require('../assets/memory.png')}
              fadeDuration={0}
              style={{ width: 50, height: 60 }}
            /> */}
            {/* <AnimatedIcon /> */}
          </View>
          <View
            style={{
              width: this.props.textWidth + this.props.imageWidth - 140,
              alignItems: 'flex-start',
              marginRight: 20,
            }}>
            <Text style={textStyle} numberOfLines={1}>
              {this.props.desc}
            </Text>
            <Text
              style={[textStyle, { fontSize: styles.fontSize(1) }]}
              numberOfLines={1}>
              {this.props.title}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

export default WeekBox;
