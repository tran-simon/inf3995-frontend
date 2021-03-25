import { addPoint, newPoint, scalePoint } from '../Point';

describe('Point', () => {
  const a = newPoint(1, 2);
  const b = newPoint(2, 3);

  it('can add other point', () => {
    const res = addPoint(a, b);
    expect(res.x).toEqual(3);
    expect(res.y).toEqual(5);
  });

  it('can add number', () => {
    const res = addPoint(a, 5);
    expect(res.x).toEqual(6);
    expect(res.y).toEqual(7);
  });

  it('can scale by other point', () => {
    const res = scalePoint(a, b);
    expect(res.x).toEqual(2);
    expect(res.y).toEqual(6);
  });
  it('can scale by number', () => {
    const res = scalePoint(a, 5);
    expect(res.x).toEqual(5);
    expect(res.y).toEqual(10);
  });
});
