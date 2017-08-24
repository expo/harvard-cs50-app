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

    const C = ({ ...otherProps }) => {
        return (<Svg width="100" height="100" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg"><G fill-rule="nonzero" fill="#000"><Path d="M298.727 104H116v292h243.636v-48.667H384V213.5h-24.364v-48.667L298.727 104zm48.728 279.833H128.182V116.167h170.545v48.666h48.728V213.5h-194.91v133.833h194.91v36.5zm24.363-158.166v109.5h-207.09v-109.5h207.09z" fill="#A41034"/><Path d="M189 299.8h12.167V312H189v-12.2zm24.333 12.2H262v-12.2h-36.5v-36.6H262V251h-48.667v61z" fill="#A41034"/></G></Svg>
        );
    };
    export default C;