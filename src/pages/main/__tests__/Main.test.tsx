import React from 'react';
import Main from '../Main';
import { create } from 'react-test-renderer';

jest.mock('react-router-dom', () => ({
  useParams: () => ({
    mapId: 'MAP_ID',
  }),
  useHistory: jest.fn(),
}));

describe('Main', () => {
  it('can match snapshot', () => {
    expect(create(<Main />)).toMatchSnapshot();
  });
});
