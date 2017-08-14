import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Foundation, MaterialIcons } from '@expo/vector-icons';

const ICON_COLOR = '#FFFFFF';
const CENTER_ICON_SIZE = 36;
const BOTTOM_BAR_ICON_SIZE = 30;

export const PlayIcon = () =>
  <Foundation
    name={'play'}
    size={36}
    color={ICON_COLOR}
    style={{ textAlign: 'center' }}
  />;

export const PauseIcon = () =>
  <Foundation
    name={'pause'}
    size={36}
    color={ICON_COLOR}
    style={{ textAlign: 'center' }}
  />;

export const Spinner = () =>
  <ActivityIndicator color={ICON_COLOR} size={'large'} />;

export const FullscreenEnterIcon = () =>
  <MaterialIcons
    name={'fullscreen'}
    size={30}
    color={ICON_COLOR}
    style={{ textAlign: 'center' }}
  />;

export const FullscreenExitIcon = () =>
  <MaterialIcons
    name={'fullscreen-exit'}
    size={30}
    color={ICON_COLOR}
    style={{ textAlign: 'center' }}
  />;

export const ReplayIcon = () =>
  <MaterialIcons
    name={'replay'}
    size={36}
    color={ICON_COLOR}
    style={{ textAlign: 'center' }}
  />;
