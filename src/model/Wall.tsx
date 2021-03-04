import { Point } from '../utils/utils';
import Crazyflie from './Crazyflie';

export default interface Wall {
  position: Point;
  crazyflie: Crazyflie;
}
