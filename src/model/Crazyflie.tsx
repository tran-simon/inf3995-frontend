import { Point } from '../utils/utils';

export default interface Crazyflie {
  droneId?: string;
  battery?: number;
  speed?: number;
  position?: Point;

  sensors?: Sensor;
}

export interface Sensor {
  north?: number;
  south?: number;
  east?: number;
  west?: number;
  [key: string]: number | undefined;
}
