import fs from 'fs';
import path from 'path';
import SVGO from 'svgo';
import _ from 'lodash';

const svgo = new SVGO({
  plugins: [
    { removeTitle: true },
    {
      removeNounText: {
        type: 'perItem', // full, perItem or perItemReverse
        description: 'removes Noun Porject <text> elements',
        params: { text: true },
        fn: function(item, params) {
          if (
            item.content &&
            (item.content[0].text === 'from the Noun Project' ||
              String(item.content[0].text).startsWith('Created by'))
          ) {
            return false;
          }

          // custom plugin code goes here
          return true;
        },
      },
    },
    {
      changeSvgWidth: {
        type: 'full',
        description: '',
        params: {},
        fn: function(data) {
          const svg = data.content[0];
          svg.removeAttr('viewBox');
          svg.addAttr({
            name: 'viewBox',
            value: '0 0 100 100',
            prefix: '',
            local: 'viewBox',
          });
          svg.addAttr({
            name: 'width',
            value: '100',
            prefix: '',
            local: 'width',
          });
          svg.addAttr({
            name: 'height',
            value: '100',
            prefix: '',
            local: 'height',
          });
          return data;
        },
      },
    },
  ],
});

const SVG_PATH = 'assets/svgs/originals';
const SVG_PROCESSED_PATH = 'assets/svgs/processed';

fs.readdirSync(SVG_PATH).forEach(file => {
  if (path.extname(file) == '.svg') {
    svgo.optimize(fs.readFileSync(path.join(SVG_PATH, file)), function(result) {
      fs.writeFileSync(
        path.resolve(path.join(SVG_PROCESSED_PATH, file)),
        result.data
      );
    });
  }
});
