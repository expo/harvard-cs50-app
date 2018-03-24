import React from 'react';
import Svg, {
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Text,
  Use,
  Defs,
  Stop,
} from 'react-native-svg';

const Arrays = ({ ...otherProps }) => {
  return (
    <Svg
      width="100"
      height="100"
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M222.848 103H112.209a9.228 9.228 0 0 0-9.209 9.21v110.638a9.228 9.228 0 0 0 9.21 9.21h110.638a9.25 9.25 0 0 0 9.21-9.21V112.209a9.243 9.243 0 0 0-9.21-9.209zm165.943 0H278.152a9.228 9.228 0 0 0-9.21 9.21v110.638a9.228 9.228 0 0 0 9.21 9.21h110.639a9.255 9.255 0 0 0 9.209-9.21V112.209a9.234 9.234 0 0 0-9.21-9.209zM222.848 268.943H112.209a9.228 9.228 0 0 0-9.209 9.209v110.639a9.228 9.228 0 0 0 9.21 9.209h110.638a9.25 9.25 0 0 0 9.21-9.21V278.153a9.25 9.25 0 0 0-9.21-9.21zm165.943 0H278.152a9.228 9.228 0 0 0-9.21 9.209v110.639a9.228 9.228 0 0 0 9.21 9.209h110.639a9.255 9.255 0 0 0 9.209-9.21V278.153a9.243 9.243 0 0 0-9.21-9.21z"
        fill-rule="nonzero"
        fill="#A41034"
      />
    </Svg>
  );
};
export default Arrays;
