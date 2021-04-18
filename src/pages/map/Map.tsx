import {
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  Slider,
  Tooltip,
} from '@material-ui/core';
import React, { useContext, useRef, useState } from 'react';
import MapViewport from './MapViewport';
import CameraControls from './CameraControls';
import { useMouseHandler } from '../../hooks';
import { DEFAULT_ZOOM } from '../../utils/constants';
import Point, { addPoint, newPoint } from '../../utils/Point';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import CFContext from '../../context/CFContext';

export const calcZoom = (zoom: number, defaultZoom = DEFAULT_ZOOM) => {
  return (defaultZoom * defaultZoom) / zoom;
};

/**
 *
 * based on https://css-tricks.com/creating-a-panning-effect-for-svg/
 *
 */
const Map = () => {
  const mapRef = useRef<SVGSVGElement | null>(null);
  const [link, setLink] = useState<null | string>(null);
  const { name } = useContext(CFContext);

  /**
   * Zoom percentage
   */
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const size = calcZoom(zoom);

  const [cameraPos, setCameraPos] = useState<Point>(newPoint(0, 0));

  const ratioX =
    mapRef.current &&
    size / (mapRef.current.getBoundingClientRect().width || 1);
  const ratioY =
    mapRef.current &&
    size / (mapRef.current.getBoundingClientRect().height || 1);

  const mouseHandler = useMouseHandler({
    onMouseDrag: (event, origin) => {
      if (ratioX && ratioY) {
        const x = cameraPos.x - (event.clientX - origin.x) * ratioX;
        const y = cameraPos.y - (event.clientY - origin.y) * ratioY;
        setCameraPos(newPoint(x, y));
      }
    },
  });

  return (
    <>
      <MapViewport
        viewBox={`${cameraPos.x} ${cameraPos.y} ${size} ${size}`}
        style={{ position: 'absolute' }}
        ref={mapRef}
        onWheel={(event) => {
          if (event.ctrlKey) {
            setZoom(zoom - event.deltaY);
            event.preventDefault();
          } else {
            const deltaX = !ratioX
              ? 0
              : !event.shiftKey
              ? event.deltaX * ratioX
              : event.deltaY * ratioX;
            const deltaY =
              event.shiftKey || !ratioY ? 0 : event.deltaY * ratioY;

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
        <Grid item xs={11} container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Slider
              id="slider-zoom"
              value={zoom}
              onChange={(e, v) => setZoom(v as number)}
              max={200}
              min={1}
            />
          </Grid>
        </Grid>
        <Grid item xs={1}>
          <IconButton
            style={{
              position: 'absolute',
              right: 0,
            }}
            onClick={() => {
              if (mapRef.current) {
                const serializer = new XMLSerializer();
                const source = serializer.serializeToString(mapRef.current);
                const url =
                  'data:image/svg+xml;charset=utf-8,' +
                  encodeURIComponent(source);
                setLink(url);
              }
            }}
          >
            <Tooltip title="Télécharger l'image SVG">
              <SaveAltIcon />
            </Tooltip>
          </IconButton>
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
      <Dialog
        open={!!link}
        onClose={() => {
          setLink(null);
        }}
      >
        <DialogTitle>
          {link && (
            <a href={link} download={name + '.svg'}>
              Cliquez ici pour télécharger
            </a>
          )}
        </DialogTitle>
      </Dialog>
    </>
  );
};

export default Map;
