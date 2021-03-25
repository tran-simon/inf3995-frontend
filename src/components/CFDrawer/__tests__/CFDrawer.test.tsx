import { CFProvider } from '../../../context/CFContext';
import React from 'react';
import { CFDrawer } from '../CFDrawer';
import { render, waitFor } from '@testing-library/react';
import Crazyflie from '../../../model/Crazyflie';

describe('CFDrawer', () => {
  const cf1: Crazyflie = {
    battery: 10,
    state: 'In mission',
    speed: 1,
    data: [],
  };
  const cf2: Crazyflie = {
    battery: 90,
    state: 'Crashed',
    data: [],
  };

  const DrawerComp = (
    <CFProvider
      date={Date.now()}
      _key=""
      refreshRate={0}
      backendDisconnected={false}
      cfList={{ cf1, cf2 }}
    >
      <CFDrawer />
    </CFProvider>
  );

  it('can match snapshot', async () => {
    await waitFor(() => {
      expect(render(DrawerComp).asFragment()).toMatchSnapshot();
    });
  });
});
