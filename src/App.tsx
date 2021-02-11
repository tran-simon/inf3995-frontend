import React, { useEffect, useState } from 'react';
import './App.css';
import Switch from '@material-ui/core/Switch';
import firebase from 'firebase';
import { Button } from '@material-ui/core';

function App() {
  const [delState, setDelState] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [robotState, setRobotState] = useState<string>('No Crazyflies found');

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

  useEffect(() => {
    fetch(`/getState`).then((res) => {
      if (res.ok) {
        return res.json().then((data) => setDelState(!!data.result));
      }
    });

    const getBattery = setInterval(() => {
      fetch(`/getBatteryLevel`).then((res) => {
        if (res.ok) {
          return res.json().then((data) => {
            setBatteryLevel(data.result);
          });
        }
      });
    }, 1000);
    return () => clearInterval(getBattery);
  });

  const button = () => {
    fetch(`/changeState`).then(() => {
      fetch(`/getState`).then((res) => {
        if (res.ok) {
          return res.json().then((data) => {
            setDelState(!!data.result);
          });
        }
      });
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Crazyflie Control Center</h1>
        <p>DEL</p>
        <Switch
          checked={delState}
          onChange={button}
          color="secondary"
          name="delState"
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
        <p>Battery Level : {batteryLevel} %</p>
        {robotState}
        <Button
          onClick={() => {
            fetch(`/scan`)
              .then((response) => {
                return response.text();
              })
              .then((data) => {
                setRobotState(data);
              });
          }}
        >
          Scan
        </Button>
      </header>
    </div>
  );
}

export default App;
