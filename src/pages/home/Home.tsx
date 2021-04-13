import React, { useState } from 'react';
import {
  Button,
  ButtonProps,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  List,
  ListItem,
  Paper,
  Switch,
  TableContainer,
  TextField,
  Typography,
  useTheme,
} from '@material-ui/core';
import { FirebaseDatabaseMutation } from '@react-firebase/database';
import MapData from '../../model/MapData';
import MapsTable from './MapsTable';
import { useHistory } from 'react-router-dom';
import { RunMutation } from '@react-firebase/database/dist/components/FirebaseDatabaseMutation';

/**
 * Home page
 *
 * Inspired from https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/album/Album.js
 *
 */
const Home = () => {
  const theme = useTheme();

  return (
    <>
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <Container
          maxWidth="sm"
          style={{
            padding: theme.spacing(8, 0, 6),
          }}
        >
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
            style={{ fontSize: '3rem' }}
          >
            Centre de contrôle des Crazyflies
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph
          >
            INF3995 - Équipe 100
          </Typography>
        </Container>
        <Container maxWidth="md">
          <TableContainer
            component={Paper}
            style={{
              height: '50vh',
            }}
          >
            <MapsTable />
          </TableContainer>

          <FirebaseDatabaseMutation path={`/maps`} type={'push'}>
            {({ runMutation }) => (
              <NewExplorationBtn
                runMutation={runMutation}
                variant="contained"
                style={{ width: '100%', margin: '1rem 0' }}
              />
            )}
          </FirebaseDatabaseMutation>
        </Container>
      </main>
    </>
  );
};

export const NewExplorationBtn = ({
  runMutation,
  ...props
}: ButtonProps & {
  runMutation: RunMutation;
}) => {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(MapData.create);

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        {...props}
      >
        Nouvelle Exploration...
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Nouvelle Exploration</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <TextField
                label="Nom"
                value={data.name ?? ''}
                onChange={(e) =>
                  setData({
                    ...data,
                    name: e.target.value,
                  })
                }
                autoFocus
              />
            </ListItem>

            <ListItem>
              <FormControlLabel
                control={
                  <Switch
                    checked={!!data.simulation}
                    onChange={(e) => {
                      setData({ ...data, simulation: e.target.checked });
                    }}
                    color="primary"
                  />
                }
                label="Simulation"
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button
            onClick={() => {
              runMutation(MapData.toDto(data)).then((v) => {
                setOpen(false);
                v.key && history.push(`/explore/${v.key}`);
              });
            }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Home;
