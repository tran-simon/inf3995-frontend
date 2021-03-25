import { CFData } from './Crazyflie';
import Point from '../utils/Point';

export default interface Wall {
  position: Point;
  cfData: CFData;

  /**
   * If the sensors hasn't detected any wall
   */
  outOfRange?: boolean;
}
