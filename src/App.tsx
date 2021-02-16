// @ts-ignore
import React, { useEffect, useState } from 'react';
import './App.css';
import firebase from 'firebase';
import { Button } from '@material-ui/core';

function App() {
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [droneNumber, setDroneNumber] = useState(0);

  const firebaseConfig = {
    apiKey: 'AIzaSyAp9j7bZz1OXvO8ZJElH36pKarkLQdOg-o',
    authDomain: 'inf3995-100.firebase.com',
    databaseURL: 'https://inf3995-100-default-rtdb.firebaseio.com/',
    projectId: 'inf3995-100',
    storageBucket: 'inf3995-100.appspot.com',
    appId: '1:749259130279:web:69ae347d4cdfa89418e282',
  };

  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
  const database = firebase.database();

  useEffect(() => {
    const getStats = setInterval(() => {
      fetch(`/getStats`).then((res) => {
        if (res.ok) {
          getBattery();
          getDroneNumber();
        }
      });
    }, 1000);
    return () => clearInterval(getStats);
  });

  const getBattery = () => {
    database
      .ref('battery0/')
      .get()
      .then((dataSnap) => setBatteryLevel(+dataSnap.val()));
  };

  const getDroneNumber = () => {
    database
      .ref('number/')
      .get()
      .then((dataSnap) => setDroneNumber(+dataSnap.val()));
  };

  const startSimulation = () => {
    fetch(`/startSim`);
  };

  const land = () => {
    fetch(`/land`);
  };

  const takeOff = () => {
    fetch(`/takeOff`);
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
            fetch(`/scan`);
          }}
        >
          Scan for Crazyflies
        </Button>
      </header>
    </div>
  );
}

export default App;
