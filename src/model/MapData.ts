import Crazyflie from './Crazyflie';
import { format } from 'date-fns';
import _ from 'lodash';
import { KeyArray } from '../utils';

export default class MapData {
  date: number;
  cfList: KeyArray<Crazyflie>;
  name?: string;
  simulation?: boolean;

  private constructor(mapData: MapData) {
    this.date = mapData.date;
    this.cfList = mapData.cfList;

    Object.assign(this, mapData);
  }

  /**
   * Create a new MapData with default values
   * date will be set to today
   * name will be the date formatted
   *
   */
  static create(mapData?: Partial<MapData>): MapData {
    const date = mapData?.date ?? Date.now();
    return new MapData({
      date,
      name: format(Date.now(), 'Pp'),
      cfList: {},
      ...mapData,
    });
  }

  /**
   * Creates a MapData from a DTO
   *
   * default values will be used:
   * date: The current date
   *
   * @param mapData
   */
  static fromDto(mapData: MapDataDTO): MapData {
    /* Add the required values (data) to all the cfs in the list */
    const cfList = !mapData.cfList
      ? {}
      : Object.keys(mapData.cfList).reduce(
          (cfList, key): KeyArray<Crazyflie> => {
            const cf = mapData.cfList && mapData.cfList[key];
            return !cf
              ? cfList
              : {
                  ...cfList,
                  [key]: {
                    ...cf,
                    data: cf.data ?? [],
                  },
                };
          },
          {},
        );

    return new MapData({
      date: Date.now(),
      ...mapData,
      cfList,
    });
  }

  /**
   * Remove undefined values from mapData to transform it into a Data Transfer Object ready to be saved in the database
   * @param mapData
   */
  static toDto(mapData: MapData): MapDataDTO {
    /* Removed undefined values from objects in cfList */
    const cfList = Object.keys(mapData.cfList).reduce(
      (cfList, key): KeyArray<Crazyflie> => {
        const cf = mapData.cfList[key];
        return !cf
          ? cfList
          : {
              ...cfList,
              [key]: _.omitBy(
                {
                  ...cf,
                  data: cf.data.map((data) => _.omitBy(data, _.isUndefined)),
                },
                _.isUndefined,
              ),
            };
      },
      {},
    );

    return _.omitBy<MapData>(
      {
        ...mapData,
        cfList,
      },
      _.isUndefined,
    );
  }
}

export type MapDataDTO = Partial<MapData>;
