import React from 'react';
import Layout from '../Layout';
import { create } from 'react-test-renderer';
import CFContext from '../../../context/CFContext';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

jest.mock('@react-firebase/database', () => ({
  FirebaseDatabaseMutation: ({ children }) =>
    children({
      runMutation: jest.fn(),
    }),
}));

jest.mock('react-router-dom', () => ({
  useParams: () => ({
    mapId: 'MAP_ID',
  }),
  useHistory: jest.fn(),
}));

describe('layout', () => {
  const LayoutComp = (
    <CFContext.Provider
      value={
        {
          _key: 'key',
          name: 'name_1',
          showLogs: false,
          cfList: {},
          save: () => {},
        } as any
      }
    >
      <Layout>layout</Layout>
    </CFContext.Provider>
  );

  it('can match snapshot', () => {
    expect(create(LayoutComp)).toMatchSnapshot();
  });

  it('can open go back dialog', async () => {
    render(LayoutComp);
    expect(screen.queryByRole('dialog')).toBeNull();

    const item = screen.getByText('Retour');
    fireEvent.click(item);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).not.toBeNull();
    });
  });
});
