import { Grid, Slider } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import MapViewport from './MapViewport';
import CameraControls from './CameraControls';
import { useMouseHandler } from '../../hooks';
import { DEFAULT_ZOOM } from '../../utils/constants';
import Point, { addPoint, newPoint } from '../../utils/Point';

/**
 *
 * based on https://css-tricks.com/creating-a-panning-effect-for-svg/
 *
 */
const Map = () => {
  const mapRef = useRef<SVGSVGElement | null>(null);

  /**
   * Zoom percentage
   */
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const size = (DEFAULT_ZOOM * DEFAULT_ZOOM) / zoom;

  const [cameraPos, setCameraPos] = useState<Point>(newPoint(0, 0));

  const [keyPressed, setKeyPressed] = useState<string | undefined>();

  const ratioX =
    mapRef.current && size / mapRef.current.getBoundingClientRect().width;
  const ratioY =
    mapRef.current && size / mapRef.current.getBoundingClientRect().height;

  const mouseHandler = useMouseHandler({
    onMouseDrag: (event, origin) => {
      if (ratioX && ratioY) {
        const x = cameraPos.x - (event.clientX - origin.x) * ratioX;
        const y = cameraPos.y - (event.clientY - origin.y) * ratioY;
        setCameraPos(newPoint(x, y));
      }
    },
  });

  document.addEventListener('keydown', (event) => {
    setKeyPressed(event.key);
  });
  document.addEventListener('keyup', () => {
    setKeyPressed(undefined);
  });

  return (
    <>
      <MapViewport
        viewBox={`${cameraPos.x} ${cameraPos.y} ${size} ${size}`}
        style={{ position: 'absolute' }}
        ref={mapRef}
        onWheel={(event) => {
          if (keyPressed === 'Control') {
            setZoom(zoom - event.deltaY);
          } else {
            const deltaX = !ratioX
              ? 0
              : keyPressed !== 'Shift'
              ? event.deltaX * ratioX
              : event.deltaY * ratioX;
            const deltaY =
              keyPressed === 'Shift' || !ratioY ? 0 : event.deltaY * ratioY;

            setCameraPos(addPoint(cameraPos, newPoint(deltaX, deltaY)));
          }
        }}
        {...mouseHandler}
      />

      <Grid
        container
        style={{ height: '100%', padding: '1rem' }}
        alignContent="space-between"
      >
        <Grid item xs={12} container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Slider
              value={zoom}
              onChange={(e, v) => setZoom(v as number)}
              max={200}
              min={1}
            />
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          container
          spacing={2}
          style={{ height: '50%' }}
        >
          <CameraControls cameraPos={cameraPos} setCameraPos={setCameraPos} />
        </Grid>
      </Grid>
    </>
  );
};

export default Map;
