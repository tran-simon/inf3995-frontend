import React, { FunctionComponent, ReactElement } from 'react';
import CFContext, { CFProvider } from '../../../context/CFContext';
import { CFDrawer } from '../../../components/CFDrawer/CFDrawer';
import { render, waitFor } from '@testing-library/react';
import Logs from '../Logs';

describe('Logs', () => {
  let refreshLogs: () => Promise<string>,
    setShowLogs: () => void,
    LogsComp: FunctionComponent<any>;

  beforeEach(() => {
    refreshLogs = jest.fn(() => {
      return Promise.resolve('logs');
    });
    setShowLogs = jest.fn();

    LogsComp = ({ open = false }: { open?: boolean }) => (
      <CFContext.Provider
        value={
          {
            setShowLogs,
            refreshLogs,
          } as any
        }
      >
        <Logs open={open} />
      </CFContext.Provider>
    );
  });

  it('can match snapshot', async () => {
    await waitFor(() => {
      expect(render(<LogsComp />).asFragment()).toMatchSnapshot();
    });
  });

  it('refreshes on open', async () => {
    const { rerender } = render(<LogsComp />);
    expect(refreshLogs).not.toHaveBeenCalled();

    await waitFor(() => {
      rerender(<LogsComp open />);
      expect(refreshLogs).toHaveBeenCalled();
    });
  });
});
