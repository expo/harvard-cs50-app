import React from 'react';
import Expo from 'expo';
const THREE = require('three');
import ExpoTHREE from 'expo-three';
import colors from '../styles/colors';

// THREE warns us about some GL extensions that `Expo.GLView` doesn't support
// yet. This is ok, most things will still work, and we'll support those
// extensions hopefully soon.
console.disableYellowBox = true;

class AnimatedIcon extends React.Component {
  _onGLContextCreate = async gl => {
    // Based on https://threejs.org/docs/#manual/introduction/Creating-a-scene
    // In this case we instead use a texture for the material (because textures
    // are cool!). All differences from the normal THREE.js example are
    // indicated with a `NOTE:` comment.

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      100,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      10
    );

    // NOTE: How to create an `Expo.GLView`-compatible THREE renderer
    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: colors.primary });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 1.3;

    const render = () => {
      requestAnimationFrame(render);

      cube.rotation.x += 0.03;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);

      // NOTE: At the end of each frame, notify `Expo.GLView` with the below
      gl.endFrameEXP();
    };
    render();
  };

  render() {
    // Create an `Expo.GLView` covering the whole screen, tell it to call our
    // `_onGLContextCreate` function once it's initialized.
    return (
      <Expo.GLView
        style={{
          flex: 1,
          width: 80,
          height: 80,
        }}
        onContextCreate={this._onGLContextCreate}
      />
    );
  }
}

export default AnimatedIcon;
