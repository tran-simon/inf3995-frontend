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
  const { cfList, takeoff, land, setBackendUrl, backendUrl } = useContext(
    CFContext,
  );

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
        <Typography variant="h2">Nombre de drones: {cfList.length}</Typography>
      </Grid>

      <Grid item>
        <Button onClick={takeoff}>Décoller</Button>
      </Grid>
      <Grid item>
        <Button onClick={land}>Atterrir</Button>
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
    </Grid>
  );
};

export default ControlDrawer;
