import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [delState, setDelState] = useState(false);

  useEffect(() => {
    fetch('/getState')
      .then((res) => res.json())
      .then((data) => {
        setDelState(data.result);
      });
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
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <button onClick={button}>Activate DEL</button>
        <p>Etat DEL : {delState.toString()}</p>
      </header>
    </div>
  );
}

export default App;
