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
import ControlDrawer from '../../components/ControlDrawer/ControlDrawer';

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
    content: {
      overflow: 'auto',
      padding: '1rem',
      flexGrow: 1,
    },
  });
});

const Layout = ({ children }: { children: ReactNode }) => {
  const classes = useStyles();

  return (
    <Box display="flex" height="100vh">
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
      <Box display="flex" flexDirection="column" flexGrow="1" overflow="hidden">
        <Toolbar />
        <main className={classes.content}>{children}</main>
        <ControlDrawer />
      </Box>
    </Box>
  );
};

export default Layout;
