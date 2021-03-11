import MapViewport from '../MapViewport';
import { create } from 'react-test-renderer';
import CFContext from '../../../context/CFContext';
import React from 'react';
import { State } from '../../../model/Crazyflie';

describe('MapViewport', () => {
  const cf0 = {
    droneId: 'cf_0',
    position: {
      x: 10,
      y: 10,
    },
    state: State.inMission,
  };
  const cf1 = {
    droneId: 'cf_1',
    position: {
      x: 20,
      y: 10,
    },
    state: State.crashed,
  };

  const cfContext: any = {
    cfList: [cf0, cf1],
    walls: [
      {
        position: {
          x: 30,
          y: 10,
        },
        crazyflie: cf0,
      },
      {
        position: {
          x: 35,
          y: 10,
        },
        crazyflie: cf0,
      },
      {
        position: {
          x: 10,
          y: 15,
        },
        crazyflie: cf1,
      },
      {
        position: {
          x: 10,
          y: 20,
        },
        crazyflie: cf1,
      },
    ],
  };

  it('can match snapshot', () => {
    expect(
      create(
        <CFContext.Provider value={cfContext}>
          <MapViewport />
        </CFContext.Provider>,
      ),
    ).toMatchSnapshot();
  });
});
