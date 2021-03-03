import { Dispatch, SetStateAction } from 'react';

export type SetState<T> = Dispatch<SetStateAction<T>>;

export type Point = {
  x: number;
  y: number;
};
