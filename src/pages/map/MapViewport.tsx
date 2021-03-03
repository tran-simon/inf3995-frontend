import React, { SVGProps } from 'react';
import { Point } from '../../utils/utils';

type MapViewportProps = Partial<SVGProps<SVGSVGElement>> & {
  size?: number;
  center?: Point;
};

const MapViewport = React.forwardRef<SVGSVGElement, MapViewportProps>(
  ({ size = 100, center = { x: 0, y: 0 }, ...props }, ref) => {
    return (
      <svg
        width="100%"
        height="100%"
        viewBox={`${center.x} ${center.y} ${size} ${size}`}
        {...props}
        ref={ref}
      ></svg>
    );
  },
);

export default MapViewport;
