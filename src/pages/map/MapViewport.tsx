import React, { ReactNode, SVGProps, useContext } from 'react';

import CFContext from '../../context/CFContext';
import { getWalls, State } from '../../model/Crazyflie';
import Wall from '../../model/Wall';

const MapViewport = React.forwardRef<
  SVGSVGElement,
  Partial<SVGProps<SVGSVGElement>>
>((props, ref) => {
  const { cfList, simulation } = useContext(CFContext);

  const cfsSvg: ReactNode[] = [];
  const linesSvg: ReactNode[] = [];
  const wallsSvg: ReactNode[] = [];

  Object.keys(cfList).map((droneId) => {
    const addWalls = (walls: Wall[]) => {
      walls.forEach((wall, i) => {
        const origin = wall.cfData;
        const destination = wall.position;

        if (origin) {
          linesSvg.push(
            <line
              key={`line_${i}_${droneId}`}
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
              key={`wall_${i}_${droneId}`}
              width="2"
              height="2"
              {...destination}
              fill="red"
            >
              <title>Mur trouvé par le drone: {droneId}</title>
            </rect>,
          );
        }
      });
    };

    const cf = cfList[droneId];

    const initialPosition = cf?.initialPosition;

    if (cf && initialPosition) {
      const relativePosition = cf.data.length
        ? cf.data[cf.data.length - 1]
        : undefined;

      let { x, y } = initialPosition;
      if (relativePosition) {
        const { x: relX, y: relY } = relativePosition;
        if (relX == null || relY == null) {
          return;
        }
        x += relX;
        y += relY;
      }

      cfsSvg.push(
        <circle
          key={droneId}
          r="1"
          cx={x}
          cy={y}
          fill="blue"
          stroke={cf.state === State.crashed ? 'red' : undefined}
        >
          <title>{droneId}</title>
        </circle>,
      );
      addWalls(getWalls(cf, simulation));
    }
  });

  return (
    <svg
      width="100%"
      height="100%"
      id="map-viewport"
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

      {cfsSvg}
    </svg>
  );
});

export default MapViewport;
