import MapData from '../MapData';
import { format } from 'date-fns';

const mockedDate = 1617918315528;

describe('MapData', () => {
  beforeEach(() => {
    Date.now = jest.fn().mockReturnValue(mockedDate);
  });

  it('can create from dto with undefined values', () => {
    const expected: MapData = {
      date: mockedDate,
      cfList: {},
    };
    expect(MapData.fromDto({} as any)).toEqual(expected);
  });

  it('can create from dto with undefined values in crazyflie', () => {
    const expected: MapData = {
      date: mockedDate,
      cfList: {
        id_1: {
          data: [],
        },
      },
    };
    expect(
      MapData.fromDto({
        cfList: {
          id_1: {},
        },
      } as any),
    ).toEqual(expected);
  });

  it('can convert to dto', () => {
    expect(
      MapData.toDto({
        name: 'name-1',
        date: undefined,
      } as any),
    ).toEqual({
      name: 'name-1',
      cfList: {},
    });

    expect(
      MapData.toDto({
        cfList: {
          cf1: {
            data: undefined,
          },
        },
      } as any),
    ).toEqual({
      cfList: {
        cf1: {
          data: [],
        },
      },
    });
  });

  it('can create with default values', () => {
    expect(MapData.create({})).toEqual({
      date: mockedDate,
      name: '04/08/2021, 5:45 PM',
      cfList: {},
    });
  });
});
