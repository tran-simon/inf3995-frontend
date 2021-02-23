import React, { useState } from 'react';
import { CFProvider } from '../../context/CFContext';
import Layout from './Layout';

function Main() {
  const [batteryLevel, setBatteryLevel] = useState();
  const [droneNumber, setDroneNumber] = useState(0);

  // useEffect(() => {
  //   const getStats = setInterval(() => {
  //     fetch(`${BACKEND_URL}/getStats`).then((res) => {
  //       if (res.ok) {
  //         res.json().then((data) => {
  //           const keys = Object.keys(data);
  //           setBatteryLevel(keys.length > 0 ? data[keys[0]] : undefined);
  //           setDroneNumber(keys.length);
  //         });
  //       }
  //     });
  //   }, 1000);
  //   return () => clearInterval(getStats);
  // });
  //
  // const startSimulation = () => {
  //   fetch(`${BACKEND_URL}/startSim`);
  // };
  //
  // const land = () => {
  //   fetch(`${BACKEND_URL}/land`);
  // };
  //
  // const takeOff = () => {
  //   fetch(`${BACKEND_URL}/takeOff`);
  // };

  return (
    <div>
      <CFProvider
        scan={() => {
          return new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      >
        <Layout>
          test
          <h1>Crazyflie Control Center</h1>
          <p>Battery Level : {batteryLevel} %</p>
          <p>Number of drones: {droneNumber}</p>
          {/*<Button onClick={() => startSimulation()}>Start simulation</Button>*/}
          {/*<Button onClick={() => takeOff()}>Take Off</Button>*/}
          {/*<Button onClick={() => land()}>Land</Button>*/}
          {/*<Button*/}
          {/*  onClick={() => {*/}
          {/*    fetch(`${BACKEND_URL}/scan`);*/}
          {/*  }}*/}
          {/*>*/}
          {/*  Scan for Crazyflies*/}
          {/*</Button>*/}
          {/*<Button*/}
          {/*  onClick={() => {*/}
          {/*    fetch(`${BACKEND_URL}/ConnectSocket`).then((response) => {*/}
          {/*      return response.text();*/}
          {/*    });*/}
          {/*  }}*/}
          {/*>*/}
          {/*  Start Simulation*/}
          {/*</Button>*/}
        </Layout>
      </CFProvider>
    </div>
  );
}

export default Main;
