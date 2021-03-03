import React from 'react';
import { CFProvider } from '../../context/CFContext';
import Layout from './Layout';
import { Button, Grid } from '@material-ui/core';
import Map from '../map';

function Main() {
  return (
    <div>
      <CFProvider>
        <Layout>
          <Map />
        </Layout>
      </CFProvider>
    </div>
  );
}

export default Main;
