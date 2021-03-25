import Crazyflie, { getWalls } from '../../model/Crazyflie';
import { SENSOR_MAX_RANGE } from '../../utils/constants';
import Wall from '../../model/Wall';

describe('CFContext', () => {
  it('can get walls', () => {
    const cf: Crazyflie = {
      initialPosition: {
        x: 0,
        y: 0,
      },
      data: [
        {
          x: 10,
          y: 20,
          north: 5,
          east: 20,
          south: -10,
        },
      ],
    };

    const walls = getWalls(cf);

    const expectedWalls: Wall[] = [
      {
        position: {
          x: 10,
          y: 25,
        },
        cfData: cf.data[cf.data.length - 1],
        outOfRange: false,
      },
      {
        position: {
          x: 30,
          y: 20,
        },
        cfData: cf.data[cf.data.length - 1],
        outOfRange: false,
      },
      {
        position: {
          x: 10,
          y: 30,
        },
        cfData: cf.data[cf.data.length - 1],
        outOfRange: false,
      },
      {
        position: {
          x: 10 - SENSOR_MAX_RANGE,
          y: 20,
        },
        cfData: cf.data[cf.data.length - 1],
        outOfRange: true,
      },
    ];

    expect(walls).toEqual(expect.arrayContaining(expectedWalls));
  });
});
