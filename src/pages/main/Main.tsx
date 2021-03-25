import React from 'react';
import { CFProvider } from '../../context/CFContext';
import Layout from './Layout';
import Map from '../map';
import { FirebaseDatabaseNode } from '@react-firebase/database';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress } from '@material-ui/core';
import MapData from '../../model/MapData';

function Main() {
  const { mapId } = useParams<any>();
  return (
    <FirebaseDatabaseNode path={`/maps/${mapId}`}>
      {({ isLoading, value }) => {
        if (isLoading == null || isLoading || value === null) {
          return (
            <Box
              height="100vh"
              display="flex"
              justifyContent="space-around"
              alignItems="center"
            >
              <CircularProgress />
            </Box>
          );
        }

        return (
          <CFProvider
            {...{
              _key: mapId,
              ...MapData.fromDto(value),
            }}
          >
            <Layout>
              <Map />
            </Layout>
          </CFProvider>
        );
      }}
    </FirebaseDatabaseNode>
  );
}

export default Main;
