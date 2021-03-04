import React, { SVGProps, useContext } from 'react';
import { Point } from '../../utils/utils';
import CFContext from '../../context/CFContext';

type MapViewportProps = Partial<SVGProps<SVGSVGElement>> & {
  size?: number;
  center?: Point;
};

const MapViewport = React.forwardRef<SVGSVGElement, MapViewportProps>(
  ({ size = 100, center = { x: 0, y: 0 }, ...props }, ref) => {
    const { cfList, walls } = useContext(CFContext);
    return (
      <svg
        width="100%"
        height="100%"
        viewBox={`${center.x} ${center.y} ${size} ${size}`}
        {...props}
        ref={ref}
      >
        {cfList.map((cf, i) => {
          return (
            <circle
              key={i}
              r="1"
              cx={cf.position?.x}
              cy={cf.position?.y}
              fill="blue"
            >
              <title>{cf.droneId}</title>
            </circle>
          );
        })}
        {walls.map((wall, i) => {
          return (
            <rect key={i} width="1" height="1" {...wall.position} fill="red">
              <title>Wall found by drone: {wall.crazyflie.droneId}</title>
            </rect>
          );
        })}
      </svg>
    );
  },
);

export default MapViewport;
