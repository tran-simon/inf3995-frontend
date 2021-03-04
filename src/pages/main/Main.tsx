import React, { useContext } from 'react';
import CFContext, { CFProvider } from '../../context/CFContext';
import Layout from './Layout';
import { Button, Grid } from '@material-ui/core';

function Main() {
  return (
    <div>
      <CFProvider>
        <Layout>
          <Grid container spacing={2}>
            <Grid item>
              <CFContext.Consumer>
                {({ connect }) => (
                  <Button
                    onClick={() => {
                      connect();
                    }}
                  >
                    Start Simulation
                  </Button>
                )}
              </CFContext.Consumer>
            </Grid>
          </Grid>
        </Layout>
      </CFProvider>
    </div>
  );
}

export default Main;
