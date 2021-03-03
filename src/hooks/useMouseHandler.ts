import { MouseEvent, MouseEventHandler, useState } from 'react';
import { Point } from '../utils/utils';

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
    setDragOrigin({ x: clientX, y: clientY });
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
      setDragOrigin({ x: clientX, y: clientY });
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
