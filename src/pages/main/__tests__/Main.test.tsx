import React from 'react';
import Main from '../Main';
import { create } from 'react-test-renderer';

describe('Main', () => {
  it('can match snapshot', () => {
    expect(create(<Main />)).toMatchSnapshot();
  });
});
