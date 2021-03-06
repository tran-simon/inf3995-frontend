import Point from '../utils/Point';

export default interface Crazyflie {
  droneId?: string;
  battery?: number;
  speed?: number;
  position?: Point;
  state?: StateType;

  sensors?: Sensor;
}

export interface Sensor {
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
