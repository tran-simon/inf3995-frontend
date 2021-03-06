import React, { ReactNode, useState } from 'react';
import {
  AppBar,
  Box,
  createStyles,
  Divider,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import CFDrawer from '../../components/CFDrawer';
import ControlDrawer from '../../components/ControlDrawer/ControlDrawer';
import clsx from 'clsx';

import MenuIcon from '@material-ui/icons/Menu';

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
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    drawerToolbar: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    drawerToolbarBtn: {
      marginRight: 36,
    },

    content: {
      overflow: 'hidden',
      flexGrow: 1,
      position: 'relative',
    },
  });
});

const Layout = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  return (
    <Box display="flex" height="100vh">
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            onClick={() => {
              setOpen(!open);
            }}
            edge="start"
            className={classes.drawerToolbarBtn}
          >
            <MenuIcon />
          </IconButton>
          <Typography>Centre de contrôle des Crazyflies</Typography>
        </Toolbar>
      </AppBar>
      <CFDrawer
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <Toolbar />
        <Divider />
      </CFDrawer>
      <Box
        display=" flex"
        flexDirection=" column"
        flexGrow="1"
        overflow="hidden"
      >
        <Toolbar />
        <main className={classes.content}>{children}</main>
        <ControlDrawer />
      </Box>
    </Box>
  );
};

export default Layout;
