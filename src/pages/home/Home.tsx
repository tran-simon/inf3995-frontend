import React from 'react';
import {
  Button,
  Container,
  Paper,
  TableContainer,
  Typography,
  useTheme,
} from '@material-ui/core';
import { FirebaseDatabaseMutation } from '@react-firebase/database';
import MapData from '../../model/MapData';
import MapsTable from './MapsTable';
import { useHistory } from 'react-router-dom';

/**
 * Home page
 *
 * Inspired from https://github.com/mui-org/material-ui/blob/master/docs/src/pages/getting-started/templates/album/Album.js
 *
 */
const Home = () => {
  const theme = useTheme();
  const history = useHistory();

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
          <FirebaseDatabaseMutation path={'/maps'} type={'push'}>
            {({ runMutation }) => (
              <Button
                variant="contained"
                style={{ width: '100%', margin: '1rem 0' }}
                onClick={() => {
                  runMutation(new MapData()).then((v) => {
                    v.key && history.push(`/explore/${v.key}`);
                  });
                }}
              >
                Nouvelle Exploration...
              </Button>
            )}
          </FirebaseDatabaseMutation>
        </Container>
      </main>
    </>
  );
};

export default Home;
