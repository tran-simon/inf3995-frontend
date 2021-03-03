import {
  Box,
  createStyles,
  IconButton,
  makeStyles,
  Slider,
} from '@material-ui/core';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import React from 'react';
import { Point, SetState } from '../../utils/utils';

const useStyles = makeStyles(() => {
  return createStyles({
    root: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'flex-end',
    },
    leftSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
    },
  });
});

type CameraControlsProps = {
  cameraPos: Point;
  setCameraPos: SetState<Point>;
  max?: number;
};

const CameraControls = ({
  cameraPos,
  setCameraPos,
  max = 100,
}: CameraControlsProps) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Box className={classes.leftSection}>
        <Slider
          orientation="vertical"
          value={cameraPos.y}
          onChange={(e, v) => setCameraPos({ x: cameraPos.x, y: v as number })}
          max={max}
          min={-max}
        />
        <IconButton
          onClick={() => {
            setCameraPos({
              x: 0,
              y: 0,
            });
          }}
        >
          <MyLocationIcon />
        </IconButton>
      </Box>
      <Slider
        value={cameraPos.x}
        onChange={(e, v) => setCameraPos({ y: cameraPos.y, x: v as number })}
        max={max}
        min={-max}
      />
    </Box>
  );
};

export default CameraControls;
