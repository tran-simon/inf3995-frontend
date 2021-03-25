import Crazyflie, { getWalls } from '../../model/Crazyflie';
import { SENSOR_MAX_RANGE } from '../../utils/constants';
import Wall from '../../model/Wall';

describe('CFContext', () => {
  it('can get walls', () => {
    const cf: Crazyflie = {
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
        crazyflie: cf,
        outOfRange: false,
      },
      {
        position: {
          x: 30,
          y: 20,
        },
        crazyflie: cf,
        outOfRange: false,
      },
      {
        position: {
          x: 10,
          y: 30,
        },
        crazyflie: cf,
        outOfRange: false,
      },
      {
        position: {
          x: 10 - SENSOR_MAX_RANGE,
          y: 20,
        },
        crazyflie: cf,
        outOfRange: true,
      },
    ];

    expect(walls).toEqual(expect.arrayContaining(expectedWalls));
  });
});
