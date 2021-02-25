import React from 'react';
import Layout from '../Layout';
import { create } from 'react-test-renderer';

describe('layout', () => {
  it('can match snapshot', () => {
    expect(create(<Layout>layout</Layout>)).toMatchSnapshot();
  });
});
