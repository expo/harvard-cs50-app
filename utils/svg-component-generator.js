import fs from 'fs';
import path from 'path';
import SVGO from 'svgo';
import _ from 'lodash';

import colors from '../styles/colors';

const attr = (name, value) => {
  return { name: name, value: value, prefix: '', local: name };
};

const svgo = new SVGO({
  plugins: [
    { removeTitle: true },
    {
      changeSvgWidth: {
        type: 'full',
        description: '',
        params: {},
        fn: function(data) {
          const svg = data.content[0];
          svg.addAttr(attr('width', '100'));
          svg.addAttr(attr('height', '100'));
          return data;
        },
      },
    },
    {
      convertToSvg: {
        type: 'perItem',
        description: '',
        params: { text: true },
        fn: function(item, params) {
          item.elem = _.capitalize(item.elem);
          if (item.elem === 'Path') {
            item.addAttr(attr('fill', colors.primary));
          }
          return true;
        },
      },
    },
  ],
});

const SVG_PATH = 'assets/svgs/sketch';
const SVG_COMPONENTS_PATH = 'components/svgs';

fs.readdirSync(SVG_PATH).forEach(file => {
  if (path.extname(file) == '.svg') {
    let outerText = `import React from 'react';
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

    const [[NAME]] = ({ ...otherProps }) => {
        return (REPLACE
        );
    };
    export default [[NAME]];`;

    svgo.optimize(fs.readFileSync(path.join(SVG_PATH, file)), function(result) {
      const iconName = _.capitalize(path.basename(file, '.svg'));
      const svgText = result.data;
      outerText = outerText.replace(/\[\[NAME\]\]/gi, iconName);
      outerText = outerText.replace('REPLACE', svgText);
      fs.writeFileSync(
        path.resolve(path.join(SVG_COMPONENTS_PATH, iconName + '.js')),
        outerText
      );
    });
  }
});
