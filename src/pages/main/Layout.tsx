import React, { ReactNode, useContext, useState } from 'react';
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
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core';
import CFDrawer from '../../components/CFDrawer';
import ControlDrawer from '../../components/ControlDrawer/ControlDrawer';
import clsx from 'clsx';

import MenuIcon from '@material-ui/icons/Menu';
import SaveIcon from '@material-ui/icons/Save';
import { useHistory } from 'react-router-dom';
import CFContext from '../../context/CFContext';
import { FirebaseDatabaseMutation } from '@react-firebase/database';
import EditIcon from '@material-ui/icons/Edit';

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

const Name = ({
  onChange = () => {},
}: {
  onChange?: (value: string) => void;
}) => {
  const { name = '' } = useContext(CFContext);
  const [value, setValue] = useState(name);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Typography>{value}</Typography>
      <IconButton
        onClick={() => {
          setOpen(true);
        }}
      >
        <EditIcon />
      </IconButton>
      <>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Renommer</DialogTitle>
          <DialogContent>
            <TextField
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setValue(name);
                setOpen(false);
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                onChange(value);
              }}
            >
              Confirmer
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </>
  );
};

const Layout = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const { _key, save, simulation } = useContext(CFContext);

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
          {!!_key && (
            <FirebaseDatabaseMutation path={`/maps/${_key}/name`} type={'set'}>
              {({ runMutation }) => (
                <Name onChange={(value) => runMutation(value)} />
              )}
            </FirebaseDatabaseMutation>
          )}

          {simulation && (
            <Typography style={{ border: 'solid', padding: '0.5rem' }}>
              Simulation
            </Typography>
          )}

          <IconButton
            style={{ marginLeft: 'auto', marginRight: '1rem' }}
            onClick={() => save()}
          >
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
              setOpenConfirm(false);
              save().then(() => {
                history.push('/');
              });
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
