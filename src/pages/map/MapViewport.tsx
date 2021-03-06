import React, { ReactNode, SVGProps, useContext } from 'react';
import Point from '../../utils/Point';

import CFContext from '../../context/CFContext';
import { State } from '../../model/Crazyflie';

type MapViewportProps = Partial<SVGProps<SVGSVGElement>> & {
  size?: number;
  center?: Point;
};

const MapViewport = React.forwardRef<SVGSVGElement, MapViewportProps>(
  ({ size = 100, center = { x: 0, y: 0 }, ...props }, ref) => {
    const { cfList, walls } = useContext(CFContext);

    const linesSvg: ReactNode[] = [];
    const wallsSvg: ReactNode[] = [];

    walls.forEach((wall, i) => {
      const origin = wall.crazyflie.position;
      const destination = wall.position;

      if (origin) {
        linesSvg.push(
          <line
            key={`line_${i}`}
            x1={origin.x}
            x2={destination.x}
            y1={origin.y}
            y2={destination.y}
            strokeWidth={3}
            stroke={'white'}
            strokeOpacity="0.8"
            strokeLinecap="round"
          />,
        );
      }
      if (!wall.outOfRange) {
        wallsSvg.push(
          <rect
            key={`wall_${i}`}
            width="1"
            height="1"
            {...destination}
            fill="red"
          >
            <title>Mur trouvé par le drone: {wall.crazyflie.droneId}</title>
          </rect>,
        );
      }
    });

    return (
      <svg
        width="100%"
        height="100%"
        viewBox={`${center.x} ${center.y} ${size} ${size}`}
        {...props}
        style={{ backgroundColor: 'grey', ...props.style }}
        ref={ref}
      >
        <defs>
          <filter id="f1" x="0" y="0" filterUnits="userSpaceOnUse">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
        </defs>
        {linesSvg}
        {wallsSvg}

        {cfList.map((cf, i) => (
          <circle
            key={i}
            r="1"
            cx={cf.position?.x}
            cy={cf.position?.y}
            fill="blue"
            stroke={cf.state === State.crashed ? 'red' : undefined}
          >
            <title>{cf.droneId}</title>
          </circle>
        ))}
      </svg>
    );
  },
);

export default MapViewport;
