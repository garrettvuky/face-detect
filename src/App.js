import './App.css';
import React, {useRef, useEffect} from 'react';
import * as tf from "@tensorflow/tfjs";
import * as facemesh from '@tensorflow-models/facemesh';
import Webcam from "react-webcam";
import {drawBox, drawMesh} from './utilities';
function App() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution:{width:640, height:400}, scale:0.8
    });
    setInterval(() => {
      detect(net);
    }, 100);
  }

  const detect = async (net) => {
    if(typeof webcamRef.current !== "undefined" && 
    webcamRef.current !== null && 
    webcamRef.current.video.readyState === 4) {

      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const face = await net.estimateFaces(video);
      console.log(face);
      const ctx = canvasRef.current.getContext("2d");
      requestAnimationFrame(()=> {drawMesh(face,ctx); drawBox(face, ctx)});

    }
  };

  useEffect(()=> {
    runFacemesh();
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <Webcam ref={webcamRef} style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "centr",
          zIndex: 9,
          width: 640,
          height: 480,
        }}/>
      <canvas ref={canvasRef} style={{
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: 0,
        right: 0,
        textAlign: 'centr',
        zIndex: 9,
        width: 640,
        height: 480
      }}/>
      </header>
    </div>
  );
}

export default App;
