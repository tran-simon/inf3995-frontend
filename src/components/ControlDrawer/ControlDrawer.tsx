import React, { useContext } from 'react';
import {
  Button,
  Grid,
  GridProps,
  Typography,
  useTheme,
} from '@material-ui/core';
import CFContext from '../../context/CFContext';
import { MOCK_BACKEND_URL } from '../../context/useMockedCf';

const ControlDrawer = (props: GridProps) => {
  const theme = useTheme();
  const {
    cfList,
    takeoff,
    land,
    setBackendUrl,
    backendUrl,
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
        <Button
          onClick={() => {
            setBackendUrl(MOCK_BACKEND_URL);
          }}
          disabled={backendUrl === MOCK_BACKEND_URL}
        >
          Utiliser les faux crazyflies
        </Button>
      </Grid>
      <Grid item>
        <Button
          onClick={() => {
            flash().then((r) => {
              if (r) {
                r.text().then((value) => console.log(value));
              }
            });
          }}
        >
          Mettre à jour les crazyflies
        </Button>
      </Grid>
    </Grid>
  );
};

export default ControlDrawer;
