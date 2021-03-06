export default interface Point {
  x: number;
  y: number;
}

export const newPoint = (x = 0, y = 0) => {
  return { x, y };
};

export const addPoint = (point1: Point, point2: Point | number): Point => {
  if (typeof point2 === 'number') {
    return addPoint(point1, newPoint(point2, point2));
  }
  return newPoint(point1.x + point2.x, point1.y + point2.y);
};

export const scalePoint = (point1: Point, point2: Point | number): Point => {
  if (typeof point2 === 'number') {
    return scalePoint(point1, newPoint(point2, point2));
  }
  return newPoint(point1.x * point2.x, point1.y * point2.y);
};
