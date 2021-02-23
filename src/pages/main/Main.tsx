import React from 'react';
import { CFProvider } from '../../context/CFContext';
import Layout from './Layout';
import { Button, Grid } from '@material-ui/core';

function Main() {
  return (
    <div>
      <CFProvider>
        <Layout>
          <Grid container spacing={2}>
            <Grid item>
              <Button>Start Simulation</Button>
            </Grid>
          </Grid>
        </Layout>
      </CFProvider>
    </div>
  );
}

export default Main;
