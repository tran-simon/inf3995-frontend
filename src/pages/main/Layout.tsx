import React, { ReactNode } from 'react';
import {
  AppBar,
  Box,
  createStyles,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import CFDrawer from '../../components/CFDrawer';

const drawerWidth = 240;

/*
 * Drawer based on: https://material-ui.com/components/drawers/#MiniDrawer.tsx
 * */

const useStyles = makeStyles((theme) => {
  return createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: drawerWidth,
    },
  });
});

const Layout = ({ children }: { children: ReactNode }) => {
  const classes = useStyles();

  return (
    <Box display="flex">
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography>Crazyflie Control Center</Typography>
        </Toolbar>
      </AppBar>
      <CFDrawer
        className={classes.drawer}
        style={{ width: drawerWidth }}
        classes={{ paper: classes.drawer }}
      >
        <Toolbar />
      </CFDrawer>
      <main
        style={{
          flexGrow: 1,
          padding: '1rem',
        }}
      >
        <Toolbar />
        {children}
      </main>
    </Box>
  );
};

export default Layout;
