import Crazyflie from './Crazyflie';
import Point from '../utils/Point';

export default interface Wall {
  position: Point;
  crazyflie: Crazyflie;

  /**
   * If the sensors hasn't detected any wall
   */
  outOfRange?: boolean;
}
