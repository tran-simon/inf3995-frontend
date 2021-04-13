import { render, waitFor } from '@testing-library/react';
import React from 'react';
import MapsTable from '../MapsTable';

jest.mock('@react-firebase/database', () => ({
  FirebaseDatabaseNode: ({ children }) =>
    children({
      isLoading: false,
      value: {
        id_1: {
          date: 1617917731321,
          name: 'name_1',
        },
        id_2: {
          date: 1617917735555,
          name: 'name_2',
          simulation: true,
        },
      },
    }),
  FirebaseDatabaseMutation: ({ children }) =>
    children({
      runMutation: jest.fn(),
    }),
}));

describe('MapsTable', () => {
  it('can match snapshot', async () => {
    await waitFor(() => {
      expect(render(<MapsTable />).asFragment()).toMatchSnapshot();
    });
  });
});
