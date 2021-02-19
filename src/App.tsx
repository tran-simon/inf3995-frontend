import React, { useEffect, useState } from 'react';
import './App.css';
import firebase from 'firebase';
import { Button } from '@material-ui/core';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [batteryLevel, setBatteryLevel] = useState();
  const [droneNumber, setDroneNumber] = useState(0);

  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: 'inf3995-100.firebase.com',
    databaseURL: 'https://inf3995-100-default-rtdb.firebaseio.com/',
    projectId: 'inf3995-100',
    storageBucket: 'inf3995-100.appspot.com',
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  };

  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }

  useEffect(() => {
    const getStats = setInterval(() => {
      fetch(`${BACKEND_URL}/getStats`).then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            debugger;
            const keys = Object.keys(data);
            setBatteryLevel(keys.length > 0 ? data[keys[0]] : undefined);
            setDroneNumber(keys.length);
          });
        }
      });
    }, 1000);
    return () => clearInterval(getStats);
  });

  const startSimulation = () => {
    fetch(`${BACKEND_URL}/startSim`);
  };

  const land = () => {
    fetch(`${BACKEND_URL}/land`);
  };

  const takeOff = () => {
    fetch(`${BACKEND_URL}/takeOff`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Crazyflie Control Center</h1>
        <p>Battery Level : {batteryLevel} %</p>
        <p>Number of drones: {droneNumber}</p>
        <Button onClick={() => startSimulation()}>Start simulation</Button>
        <Button onClick={() => takeOff()}>Take Off</Button>
        <Button onClick={() => land()}>Land</Button>
        <Button
          onClick={() => {
            fetch(`${BACKEND_URL}/scan`);
          }}
        >
          Scan for Crazyflies
        </Button>
        <Button
          onClick={() => {
            fetch(`${BACKEND_URL}/ConnectSocket`).then((response) => {
              return response.text();
            });
          }}
        >
          Start Simulation
        </Button>
      </header>
    </div>
  );
}

export default App;
