import { CFProvider } from '../../../context/CFContext';
import React from 'react';
import { CFDrawer } from '../CFDrawer';
import { render, waitFor } from '@testing-library/react';
import Crazyflie from '../../../model/Crazyflie';

describe('CFDrawer', () => {
  const cf1: Crazyflie = {
    battery: 10,
    droneId: 'cf1',
    state: 'In mission',
    speed: 1,
  };
  const cf2: Crazyflie = {
    battery: 90,
    droneId: 'cf2',
    state: 'Crashed',
  };

  const DrawerComp = (
    <CFProvider refreshRate={0} backendDisconnected={false} cfList={[cf1, cf2]}>
      <CFDrawer />
    </CFProvider>
  );

  it('can match snapshot', async () => {
    await waitFor(() => {
      expect(render(DrawerComp).asFragment()).toMatchSnapshot();
    });
  });
});
