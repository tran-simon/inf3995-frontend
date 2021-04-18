import Map, { calcZoom } from '../Map';
import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { DEFAULT_ZOOM } from '../../../utils/constants';

describe('Map', () => {
  const delta = 10;

  it('can match snapshot', async () => {
    await waitFor(() => {
      expect(render(<Map />).asFragment()).toMatchSnapshot();
    });
  });

  it('can drag map using mouse', () => {
    render(<Map />);

    const viewport = document.querySelector('#map-viewport');
    if (viewport) {
      fireEvent.mouseDown(viewport, {
        clientX: 0,
        clientY: 0,
      });
      fireEvent.mouseMove(viewport, {
        clientX: delta,
        clientY: delta,
      });
      fireEvent.mouseUp(viewport);
    }

    const pos = -DEFAULT_ZOOM * delta;
    expect(viewport).toHaveAttribute(
      'viewBox',
      `${pos} ${pos} ${DEFAULT_ZOOM} ${DEFAULT_ZOOM}`,
    );
  });

  it('can zoom using mouse wheel', () => {
    render(<Map />);

    const viewport = document.querySelector('#map-viewport');

    if (viewport) {
      fireEvent.wheel(viewport, {
        ctrlKey: true,
        deltaY: 20,
      });
    }

    const zoom = calcZoom(80);
    expect(viewport).toHaveAttribute('viewBox', `0 0 ${zoom} ${zoom}`);
  });
});
