import React from 'react';
import Layout from '../Layout';
import { create } from 'react-test-renderer';
import * as ReactRouter from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  useParams: () => ({
    mapId: 'MAP_ID',
  }),
  useHistory: jest.fn(),
}));

describe('layout', () => {
  it('can match snapshot', () => {
    expect(create(<Layout>layout</Layout>)).toMatchSnapshot();
  });
});
