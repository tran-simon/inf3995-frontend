import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Home, { NewExplorationBtn } from '../Home';

jest.mock('@react-firebase/database');

describe('Home', () => {
  it('can match snapshot', async () => {
    await waitFor(() => {
      expect(render(<Home />).asFragment()).toMatchSnapshot();
    });
  });

  it('opens new exploration popup on button click', async () => {
    render(<NewExplorationBtn runMutation={() => {}} />);
    expect(screen.queryByRole('dialog')).toBeNull();

    const btn = screen.getByRole('button');
    fireEvent.click(btn);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeNull();
    });
  });
});
