import React, { useContext, useState } from 'react';
import {
  Button,
  CircularProgress,
  Grid,
  GridProps,
  Typography,
  useTheme,
} from '@material-ui/core';
import CFContext from '../../context/CFContext';

const ControlDrawer = (props: GridProps) => {
  const theme = useTheme();
  const [flashLoading, setFlashLoading] = useState(false);
  const {
    cfList,
    takeoff,
    land,
    returnBase,
    backendDisconnected,
    flash,
  } = useContext(CFContext);

  const crazyflies = Object.values(cfList);
  const disabled =
    !!crazyflies.find((cf) => !cf?.initialPosition) ||
    backendDisconnected ||
    !crazyflies.length;

  return (
    <Grid
      container
      spacing={2}
      style={{
        position: 'relative',
        margin: 'auto',
        marginBottom: 0,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
      {...props}
    >
      <Grid item xs={12}>
        <Typography component="h2">
          Nombre de drones: {crazyflies.length}
        </Typography>
      </Grid>

      <Grid item>
        <Button disabled={disabled} onClick={takeoff}>
          Décoller
        </Button>
      </Grid>
      <Grid item>
        <Button disabled={disabled} onClick={land}>
          Atterrir
        </Button>
      </Grid>
      <Grid item>
        <Button disabled={disabled} onClick={returnBase}>
          Retourner à la base
        </Button>
      </Grid>
      <Grid item>
        <Button
          disabled={
            flashLoading ||
            backendDisconnected ||
            crazyflies.findIndex((cf) => cf?.state !== 'Standby') !== -1
          }
          onClick={() => {
            setFlashLoading(true);
            flash().finally(() => {
              setFlashLoading(false);
            });
          }}
        >
          Mettre à jour les crazyflies&nbsp;
          {flashLoading && <CircularProgress size={20} />}
        </Button>
      </Grid>
    </Grid>
  );
};

export default ControlDrawer;
