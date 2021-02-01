import React, { useEffect, useState } from 'react';
import './App.css';
import Switch from '@material-ui/core/Switch';
import { TextField } from '@material-ui/core';

function App() {
  const [delState, setDelState] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [url, setUrl] = useState('http://127.0.0.1:5000');

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
        <TextField
          label="Backend URL"
          onChange={({ target }) => {
            setUrl(target.value);
          }}
          value={url}
        />
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
