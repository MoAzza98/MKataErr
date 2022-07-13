import React, { useEffect, useState } from 'react';
import Unity, {  UnityContext } from 'react-unity-webgl';

function App() {

  const unityContext = new UnityContext({
    loaderUrl: '/testlatest/Build/testlatest.loader.js',
    dataUrl: '/testlatest/Build/testlatest.data',
    frameworkUrl: '/testlatest/Build/testlatest.framework.js',
    codeUrl: '/testlatest/Build/testlatest.wasm',
  });
  const [progression, setProgression] = useState(0);

  useEffect(function () {
    unityContext.on('progress', function (progression) {
      setProgression(progression);
    });
  }, []);

  useEffect(function () {
    unityContext.on('canvas', function (canvas) {
      canvas.width = 1280;
      canvas.height = 720;
    });
  }, []);
  function handleOnClickFullscreen() {
    console.log('Button was pressed!');
    unityContext.setFullscreen(true);
  }

  // Initialises the application listeners and handlers
  function main() {
    const button = document.querySelector('#connect');
    button.addEventListener('click', onButtonPress);
  }

  // Button press handler
  async function onButtonPress() {
    console.log('Button was pressed!');
    const hasAllowed = await window.ic.plug.requestConnect();

    if (hasAllowed) {
      console.log('Plug wallet is connected');
    } else {
      console.log('Plug wallet connection was refused');
    }
  }

  
  // function grantNFTItem() {
  //   unityContext.send("GameController", "nftTrue");
  // }

  // Calls the Main function when the document is ready
  document.addEventListener('DOMContentLoaded', main);

  return (
    <html>
      <body>
        <div id="app">
          <Unity
            unityContext={unityContext}
            matchWebGLToCanvasSize={false}
            style={{ width: '1280px', height: '720px' }}
          />
          <p>Loading {progression * 100} percent...</p>
          <button onClick={onButtonPress}>Connect wallet</button>{' '}
          <button onClick={handleOnClickFullscreen}>Fullscreen</button>{' '}
          
        </div>
      </body>
    </html>
  );
}
export default App;
