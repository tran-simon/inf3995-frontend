import React from 'react';
import Main from '../Main';
import { create } from 'react-test-renderer';
import 'firebase/database';

jest.mock('firebase', () => ({
  database: jest.fn().mockReturnValue({
    ref: jest.fn().mockReturnValue({}),
  }),
}));

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
