import React, { useEffect, useState } from 'react';
import './App.css';
import Switch from '@material-ui/core/Switch';

function App() {
  const [delState, setDelState] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(0);

  useEffect(() => {
    fetch('/getState')
      .then((res) => res.json())
      .then((data) => {
        setDelState(data.result);
      });
    const getBattery = setInterval(() => {
      fetch('/getBatteryLevel')
        .then((res) => res.json())
        .then((data) => {
          setBatteryLevel(data.result);
        });
    }, 1000);
    return () => clearInterval(getBattery);
  }, []);

  const button = () => {
    fetch('/changeState');

    fetch('/getState')
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
