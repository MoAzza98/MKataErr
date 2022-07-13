import React, { useEffect, useState } from 'react';
import Unity, {  UnityContext } from 'react-unity-webgl';
import { Principal } from '@dfinity/principal';
import { getAllUserNFTs } from '@psychedelic/dab-js'
  
const unityContext = new UnityContext({
    loaderUrl: '/testlatest/Build/testlatest.loader.js',
    dataUrl: '/testlatest/Build/testlatest.data',
    frameworkUrl: '/testlatest/Build/testlatest.framework.js',
    codeUrl: '/testlatest/Build/testlatest.wasm',
  });

function App() {


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
  async function onButtonPress(el) {
    console.log('Button was pressed!');
    el.target.disabled = true;
    

    try {
      const hasAllowed = await window.ic.plug.requestConnect();
      if (hasAllowed) {
      console.log('Plug wallet is connected');
      } else {
        console.log('Plug wallet connection was refused');
      }
    } catch (e) {
      console.log(e);
    }

    setTimeout(function () {
      el.target.disabled = false;
    }, 5000);

  }

  const getNFTCollections = async () => {
    const principal = window.ic.plug.principalId;
    const collections = await getAllUserNFTs(
      { user: Principal.fromText(principal) }
    );
  }
  
  function grantNFTItem() {
    unityContext.send("GameController", "nftTrue");
  }

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
          <button onClick={grantNFTItem}>item</button>{' '}
          <button onClick={getNFTCollections}>get</button>{' '}
          
        </div>
      </body>
    </html>
  );
}
export default App;
