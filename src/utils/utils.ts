import { Dispatch, SetStateAction } from 'react';

export type KeyArray<T> = {
  [key: string]: T | undefined;
};
export type SetState<T> = Dispatch<SetStateAction<T>>;
