import Point, { addPoint, newPoint, scalePoint } from '../utils/Point';
import Wall from './Wall';
import { SENSOR_MAX_RANGE } from '../utils/constants';

export default interface Crazyflie {
  battery?: number;
  speed?: number;
  state?: StateType;
  data: CFData[];
  initialPosition?: Point;
}

export interface CrazyflieDTO {
  droneId?: string;
  battery?: number;
  speed?: number;
  state?: StateType;
  cfData?: CFDataDTO;

  initialPosition?: Point;
}

type CFDataDTO = (string | undefined)[][];

export interface CFData extends Partial<Point>, Sensors {}

export const cfDataFromDTO = (cfDataDto: CFDataDTO): CFData => {
  const [x, y] = cfDataDto[0];
  const [north, south, east, west] = cfDataDto[1];

  return {
    x: x != null ? +x : undefined,
    y: y != null ? +y : undefined,
    north: north != null ? +north : undefined,
    south: south != null ? +south : undefined,
    east: east != null ? +east : undefined,
    west: west != null ? +west : undefined,
  };
};

export interface Sensors {
  north?: number;
  south?: number;
  east?: number;
  west?: number;

  [key: string]: number | undefined;
}

export type StateType = 'Standby' | 'In mission' | 'Crashed';
export const State = {
  standby: 'Standby' as StateType,
  inMission: 'In mission' as StateType,
  crashed: 'Crashed' as StateType,
};

export const getWalls = (crazyflie: Crazyflie): Wall[] => {
  const res: Wall[] = [];
  const { initialPosition, data = [] } = crazyflie;

  initialPosition &&
    data.forEach((data) => {
      const { east, north, south, west, x, y } = data;
      for (let i = 0; i < 4; i++) {
        let v: number | undefined;

        let xScale = 1,
          yScale = 1;
        switch (i) {
          case 0:
            xScale = 0;
            v = north;
            break;
          case 1:
            yScale = -1;
            xScale = 0;
            v = south;
            break;
          case 2:
            yScale = 0;
            v = east;
            break;
          case 3:
            xScale = -1;
            yScale = 0;
            v = west;
            break;
          default:
            break;
        }

        const notDetected = v == null || v >= SENSOR_MAX_RANGE;
        if (notDetected) {
          v = SENSOR_MAX_RANGE;
        }

        if (x != null && y != null) {
          res.push({
            cfData: {
              ...data,
              ...addPoint({ x, y }, initialPosition),
            },
            position: addPoint(
              addPoint({ x, y }, initialPosition),
              scalePoint(newPoint(xScale, yScale), v ?? SENSOR_MAX_RANGE),
            ),
            outOfRange: notDetected,
          });
        }
      }
    });

  return res;
};
