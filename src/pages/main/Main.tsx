import React from 'react';
import { CFProvider } from '../../context/CFContext';
import Layout from './Layout';
import Map from '../map';

function Main() {
  return (
    <CFProvider>
      <Layout>
        <Map />
      </Layout>
    </CFProvider>
  );
}

export default Main;
