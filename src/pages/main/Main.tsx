import React, { useEffect, useState } from 'react';
import { CFProvider } from '../../context/CFContext';
import Layout from './Layout';
import Map from '../map';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress } from '@material-ui/core';
import MapData, { MapDataDTO } from '../../model/MapData';
import firebase from 'firebase/app';
import 'firebase/database';

const Main = () => {
  const { mapId } = useParams<any>();
  const [mapDataDto, setMapDataDto] = useState<MapDataDTO | null>(null);

  useEffect(() => {
    if (mapId) {
      firebase
        .database()
        .ref(`/maps/${mapId}`)
        .on('value', (data) => {
          const value = data.val();
          if (value) {
            setMapDataDto(value);
          }
        });
    }
  }, [mapId, setMapDataDto]);

  if (mapDataDto == null) {
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
        ...MapData.fromDto(mapDataDto),
      }}
    >
      <Layout>
        <Map />
      </Layout>
    </CFProvider>
  );
};

export default Main;
