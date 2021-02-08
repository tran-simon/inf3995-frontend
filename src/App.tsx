// @ts-ignore
import React, { useEffect, useState } from 'react';
import './App.css';
import Switch from '@material-ui/core/Switch';
import firebase from 'firebase';

function App() {
  const [delState, setDelState] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [url, setUrl] = useState('http://127.0.0.1:5000');

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
    database
      .ref('url/')
      .get()
      .then((dataSnap) => setUrl(dataSnap.val()));
  });

  useEffect(() => {
    fetch(`${url}/getState`)
      .then((res) => res.json())
      .then((data) => {
        setDelState(data.result);
      });

    const getBattery = setInterval(() => {
      fetch(`${url}/getBatteryLevel`)
        .then((res) => res.json())
        .then((data) => {
          setBatteryLevel(data.result);
        });
    }, 1000);
    return () => clearInterval(getBattery);
  }, [url]);

  const button = () => {
    fetch(`${url}/changeState`);

    fetch(`${url}/getState`)
      .then((res) => res.json())
      .then((data) => {
        setDelState(data.result);
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
      </header>
    </div>
  );
}

export default App;
