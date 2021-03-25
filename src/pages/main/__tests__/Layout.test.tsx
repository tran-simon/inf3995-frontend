import React from 'react';
import Layout from '../Layout';
import { create } from 'react-test-renderer';

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
