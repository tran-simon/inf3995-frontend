import { Dispatch, SetStateAction } from 'react';

export type KeyArray<T> = {
  [key: string]: T;
};
export type SetState<T> = Dispatch<SetStateAction<T>>;
