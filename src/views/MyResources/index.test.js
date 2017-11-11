import React from 'react';
import ReactDOM from 'react-dom';
import MyResources from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MyResources />, div);
});
