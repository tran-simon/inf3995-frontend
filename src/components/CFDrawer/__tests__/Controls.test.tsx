import { CFProvider } from '../../../context/CFContext';
import React from 'react';
import { Controls } from '../Controls';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { BackendREST } from '../../../backendApi/BackendREST';

jest.mock('../../../backendApi/BackendREST');

describe('Controls', () => {
  const ControlComp = (
    <CFProvider
      date={Date.now()}
      _key=""
      refreshRate={0}
      backendDisconnected={false}
    >
      <Controls />
    </CFProvider>
  );

  beforeEach(async () => {
    BackendREST.scan = jest.fn().mockImplementation(async () => {
      return [];
    });

    BackendREST.liveCheck = jest
      .fn()
      .mockImplementation(async (url: string) => ({
        ok: url === 'http://localhost:5000',
        json: async () => ({}),
      }));

    BackendREST.updateStats = jest.fn().mockImplementation(async () => []);

    BackendREST.reset = jest
      .fn()
      .mockImplementation(async (url?: string, sim?: boolean) => ({
        ok: true,
        json: async () => sim,
      }));

    render(ControlComp);
    await screen.findByRole('textbox');
  });

  it('can match snapshot', async () => {
    await waitFor(() => {
      expect(render(ControlComp).asFragment()).toMatchSnapshot();
    });
  });

  it('does livecheck when url changes', async () => {
    jest.clearAllMocks();
    await waitFor(() => expect(BackendREST.liveCheck).not.toHaveBeenCalled());

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'wrong_url' },
    });

    await waitFor(() => expect(BackendREST.liveCheck).toHaveBeenCalled());
  });

  it('can scan', async () => {
    fireEvent.click(screen.getByText('Balayer'));
    await waitFor(() => {
      expect(BackendREST.scan).toHaveBeenCalled();
    });
  });

  it('can toggle automatic refresh', async () => {
    jest.useFakeTimers();
    await waitFor(() => expect(BackendREST.updateStats).not.toHaveBeenCalled());

    fireEvent.click(screen.getByText('Rafraîchissement Automatique'));

    await waitFor(async () => {
      expect(BackendREST.updateStats).toHaveBeenCalled();
    });
  });
});
