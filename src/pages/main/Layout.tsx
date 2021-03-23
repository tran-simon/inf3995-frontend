import React, { ReactNode, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import SaveIcon from '@material-ui/icons/Save';
import { useHistory, useParams } from 'react-router-dom';

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
  const [openConfirm, setOpenConfirm] = useState(false);
  const { mapId } = useParams<any>();
  const history = useHistory();
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
          <Typography>Centre de contrôle des Crazyflies: {mapId}</Typography>

          <IconButton style={{ marginLeft: 'auto', marginRight: '1rem' }}>
            <SaveIcon />
          </IconButton>

          <Button
            variant="contained"
            onClick={() => {
              setOpenConfirm(true);
            }}
          >
            Retour
          </Button>
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
      <Dialog
        maxWidth="lg"
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
      >
        <DialogTitle>Voulez-vous vraiment quitter?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Les données non-sauvegardées seront perdues
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Annuler</Button>
          <Button
            onClick={() => {
              //todo  save
              setOpenConfirm(false);
              history.push('/');
            }}
          >
            Sauvegarder et Quitter
          </Button>
          <Button
            onClick={() => {
              setOpenConfirm(false);
              history.push('/');
            }}
          >
            Quitter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Layout;
