import React, { useContext } from 'react';
import {
  Button,
  Grid,
  GridProps,
  Typography,
  useTheme,
} from '@material-ui/core';
import CFContext from '../../context/CFContext';

const ControlDrawer = (props: GridProps) => {
  const theme = useTheme();
  const { cfList, takeoff, land, connect } = useContext(CFContext);

  //todo: only takeof selected cfs
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
        <Typography variant="h2">
          {cfList.map((cf) => cf.droneId)}&nbsp;
        </Typography>
      </Grid>

      <Grid item>
        <Button onClick={takeoff}>Takeoff</Button>
      </Grid>
      <Grid item>
        <Button onClick={land}>Land</Button>
      </Grid>
      <Grid item>
        <Button
          onClick={() => {
            connect();
          }}
        >
          Start Simulation
        </Button>
      </Grid>
    </Grid>
  );
};

export default ControlDrawer;
