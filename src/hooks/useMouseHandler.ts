import { MouseEvent, MouseEventHandler, useState } from 'react';
import Point, { newPoint } from '../utils/Point';

interface IMouseHandler {
  onMouseDown: MouseEventHandler;
  onMouseUp: MouseEventHandler;
  onMouseMove: MouseEventHandler;
}

const useMouseHandler = (
  props?: Partial<IMouseHandler> & {
    onMouseDrag?: (event: MouseEvent, origin: Point) => void;
  },
): IMouseHandler => {
  const [dragOrigin, setDragOrigin] = useState<null | Point>(null);

  const onMouseDown = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    setDragOrigin(newPoint(clientX, clientY));
    props?.onMouseDown && props.onMouseDown(event);
  };
  const onMouseUp = (event: MouseEvent) => {
    setDragOrigin(null);
    props?.onMouseUp && props.onMouseUp(event);
  };
  const onMouseMove = (event: MouseEvent) => {
    props?.onMouseMove && props.onMouseMove(event);
    if (dragOrigin !== null) {
      props?.onMouseDrag && props.onMouseDrag(event, dragOrigin);
      const { clientX, clientY } = event.nativeEvent;
      setDragOrigin(newPoint(clientX, clientY));
    }
  };

  window.addEventListener('mouseup', () => {
    setDragOrigin(null);
  });

  return {
    onMouseDown,
    onMouseUp,
    onMouseMove,
  };
};

export default useMouseHandler;
