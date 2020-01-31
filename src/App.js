import React, { useState, useEffect, useCallback } from "react";
import DecibelMeter from "decibel-meter";
import magicSentence from "./audio.m4a";
import "./App.css";

const meter = new DecibelMeter("unique-id");
const audio = new Audio(magicSentence);

const App = () => {
  const [listening, setListening] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (listening) {
      meter.listenTo(0, dB => {
        // 0 represents the index of the first microphone in the sources array
        if (dB > -65) {
          // When Blacky barks, we play the pre-recorded voice message
          audio.play();
        }
      });
    }
  }, [listening]);

  useEffect(() => {
    audio.addEventListener("ended", function() {
      // Once the audio file has finished playing, we increment
      // the counter to know how many times Blacky barked
      setCount(count => count + 1);
    });
    // Cleanup
    return () => audio.removeEventListener("ended");
  }, []);

  const startMic = () => {
    meter.sources
      .then(sources => {
        meter.connect(sources[0]);
        setListening(true);
      })
      .catch(err => alert("Connection Error"));
  };

  const stopMic = () => {
    meter.disconnect().then(() => {
      // Set listening to false and reset counter
      setListening(false);
      setCount(0);
    });
  };

  const toggleMic = useCallback(() => {
    if (listening) {
      stopMic();
    } else {
      startMic();
    }
  }, [listening]);

  return (
    <div className="App">
      <header className="App-header">
        <p>Welcome to Blacky Silencer App!</p>
        {listening && <p>Blacky barked {count} times so far.</p>}
        <button onClick={toggleMic}>
          {listening ? "Stop microphone" : "Get microphone input"}
        </button>
      </header>
    </div>
  );
};

export default App;
